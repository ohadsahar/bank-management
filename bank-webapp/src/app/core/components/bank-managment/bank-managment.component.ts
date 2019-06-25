import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { Bank } from '../../../shared/models/bank-data.model';
import { BankValues } from '../../../shared/models/bank.model';
import { BankTranscationService } from '../../services/bank-transcation.service';
import { MessageService } from '../../services/message.service';
import { ChartByCardName } from '../../../shared/models/chart-by-cardname.model';
import * as loginActions from '../../../store/actions/login.actions';
import * as chartActions from '../../../store/actions/chart.actions';
import * as fromRoot from '../../../app.reducer';
import { Store } from '@ngrx/store';
import * as transactionActions from '../../../store/actions/transaction.actions';

@Component({
  selector: 'app-bank-managment',
  templateUrl: './bank-managment.component.html',
  styleUrls: ['./bank-managment.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BankManagmentComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public sortedData: Bank[];
  public allTranscations: Bank[];
  public chartTranscations: ChartByCardName[];
  public arrayCardsNames: string[] = [];
  public arrayCardsTotalPrice: number[] = [];
  options: string[] = ['רנואר', 'קאסטרו', 'אייבורי'];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();
  public totalExpenses: number;
  private counter: number;
  public monthExpenses: number;
  public numberOfPayments: number;
  public editEnable: boolean;
  public updateAble: boolean;
  public chartDiff: Chart;

  private allChartsDatangrx: Subject<void> = new Subject<void>();
  public registerNewTransactionNgrx: Subject<void> = new Subject<void>();
  public editoptionsable: any = {};
  public bankTransaction = new BankValues('', '', '', '', null, null, null, null, '', '');
  public bankEditTransaction = new BankValues('', '', '', '', null, null, null, null, '', '');
  constructor(
    private bankTransactionService: BankTranscationService,
    private messageService: MessageService,
    private store: Store<fromRoot.State>
  ) {
    this.counter = 0;
    this.totalExpenses = 0;
    this.monthExpenses = 0;
    this.numberOfPayments = 0;
    this.editEnable = false;
    this.updateAble = false;
  }

  displayedColumns: string[] = [
    'id', 'cardName', 'name', 'type', 'price', 'numberofpayments', 'eachMonth', 'leftPayments', 'purchaseDate'
  ];
  cards: any[] = [{ value: 'הוט' }, { value: 'שופרסל' }, { value: 'נגב' }, { value: 'יוניק' },
  { value: 'דרים קארד' }, { value: 'מאסטר-קארד אוהד' }, { value: 'דרים קארד אוהד' }];
  categories: any[] = [{ value: 'חשמל' }, { value: 'ביגוד' }, { value: 'ריהוט' },
  { value: 'אוכל' }, { value: 'תכשיטים' }, { value: 'בריאות' }, { value: 'אחר' }];
  dataSource = new MatTableDataSource();

  ngOnInit() {
    this.onLoadSite();
  }
  onLoadSite() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.getAllTransactions();
  }
  getAllTransactions() {
    this.bankTransactionService.getTransactions().subscribe(response => {
      this.allTranscations = response.message.foundTranscations;
      // this.filteredOptions = response.message.bushinessNames.groupByBusinessName;
      this.updateTable();
      this.calculateFinancialExpenses();
      this.getAllCharts();
    });
  }
  getAllCharts() {
    this.store.dispatch(new chartActions.GetCharts());
    this.store.select(fromRoot.getChartsData).pipe(takeUntil(this.allChartsDatangrx))
      .subscribe((data) => {
        this.chartTranscations = data.data as any;
        this.assignCardNames();
      });
  }

  registerNewTransaction() {
    this.bankTransaction.name = this.myControl.value;
    if (this.validateNewTransaction()) {
      const date = moment(Date.now()).calendar().toString();
      const purchaseMonth = moment(Date.now()).month().toString();
      this.bankTransaction.purchaseDate = date + 1;
      this.bankTransaction.monthPurchase = purchaseMonth;
      this.arrayCardsNames = [];
      this.store.dispatch(new transactionActions.RegisterTransaction(this.bankTransaction));
      this.store.select(fromRoot.newTransactionData).pipe(takeUntil(this.registerNewTransactionNgrx))
      .subscribe((data) => {
          this.afterRegisterNewCard(data.data);
          this.messageService.successMessage('הקנייה התווספה בהצלחה', 'סגור');
      });
    }
  }
  deleteTransaction(transcationId: string, transactionData: Bank) {
    this.bankTransactionService.deleteTranscation(transcationId).subscribe(response => {
      const deleteTranscation = this.allTranscations.filter(transcation => transcation._id !== transcationId);
      this.allTranscations = deleteTranscation;
      this.updateFinancialExpensesAfterDelete(transactionData);
      this.updateTable();
    });
  }
  updateTransaction() {
    this.bankTransactionService.updateTransaction(this.bankEditTransaction).subscribe(response => {
      const index = this.allTranscations.findIndex(transaction => transaction._id === response.message.bankData._id);
      this.allTranscations[index] = response.message.bankData;
      this.updateAble = false;
    });
  }
  assignCardNames() {
    this.arrayCardsTotalPrice = [];
    this.chartTranscations.forEach(transactionData => {
      this.arrayCardsNames.push(transactionData.cardName);
      this.arrayCardsTotalPrice.push(transactionData.price);
    });
    this.loadCharts();
  }
  loadCharts() {
    this.chartOther('doughnut');
  }
  chartOther(type: string) {
    this.chartDiff = new Chart('chartDiff', {
      type,
      data: {
        labels: this.arrayCardsNames,
        datasets: [{
          backgroundColor: [
            '#ff6361',
            '#bc5090',
            'blue',
            'orange',
            'purple',
            'red',
            'yellow',
            'lightblue'
          ],
          borderColor: 'black',
          data: this.arrayCardsTotalPrice
        }]
      },
      options: {}
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  sortData(sort: Sort) {

    this.sortedData = this.allTranscations;
    const data = this.allTranscations.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'price': return this.compare(a.price, b.price, isAsc);
        default: return 0;
      }
    });
    this.allTranscations = this.sortedData;
  }
  calculateEachMonth() {

    if (this.bankTransaction.numberofpayments) {
      this.bankTransaction.eachMonth = this.bankTransaction.price / this.bankTransaction.numberofpayments;
      this.bankTransaction.eachMonth = Number(this.bankTransaction.eachMonth.toFixed(2));
      this.bankTransaction.leftPayments = this.bankTransaction.numberofpayments;
    } else {
      this.bankTransaction.eachMonth = null;
      this.bankTransaction.leftPayments = null;
    }
  }
  calculateEachMonthEdit() {
    if (this.bankEditTransaction.numberofpayments) {
      this.bankEditTransaction.eachMonth = this.bankEditTransaction.price / this.bankEditTransaction.numberofpayments;
      this.bankEditTransaction.eachMonth = Number(this.bankEditTransaction.eachMonth.toFixed(2));
      this.bankEditTransaction.leftPayments = this.bankEditTransaction.numberofpayments;
    } else {
      this.bankEditTransaction.eachMonth = null;
      this.bankEditTransaction.leftPayments = null;
    }
  }
  calculateFinancialExpenses() {

    this.allTranscations.forEach(transcation => {
      this.totalExpenses += transcation.price;
      if (transcation.leftPayments > 0) {
        this.numberOfPayments += transcation.leftPayments;
        this.monthExpenses += transcation.eachMonth;
      }
    });
    this._filter('');
    this.monthExpenses = Number(this.monthExpenses.toFixed(2));
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  updateTable() {
    this.dataSource = new MatTableDataSource(this.allTranscations);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  afterRegisterNewCard(response: any) {
    this.allTranscations.push(response);
    this.updateTable();
    this.updateFinancialExpensesAfterRegister(response);
    this.resetValues();
    this.getAllCharts();
  }
  editTransaction(transcationData: Bank) {
    this.updateAble = true;
    this.bankEditTransaction = transcationData;
    this.counter = this.counter + 1;
    if (this.counter === 1) {
      this.editEnable = true;
    } else {
      this.counter = 0;
    }
  }
  updateFinancialExpensesAfterDelete(transactionData: Bank) {

    this.totalExpenses -= transactionData.price;
    if (transactionData.numberofpayments > 0) {
      this.numberOfPayments -= transactionData.numberofpayments;
      this.monthExpenses -= transactionData.eachMonth;
    }
  }
  updateFinancialExpensesAfterRegister(response) {

    this.totalExpenses += response.price;
    if (response.numberofpayments > 0) {
      this.numberOfPayments += response.numberofpayments;
      this.monthExpenses += response.eachMonth;
    }
  }
  validateNewTransaction() {

    if (this.bankTransaction.cardName && this.bankTransaction.name &&
      this.bankTransaction.price && this.bankTransaction.typeProduct) {
      return true;
    }
    return false;
  }
  resetValues() {

    this.bankTransaction = new BankValues('', '', '', '', null, null, null, null, '', '');
  }
  changeChart(type: string) {
    if (this.chartDiff) {
      this.chartDiff.destroy();
    } else {
      this.chartDiff(type);
    }
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnDestroy() {
    this.registerNewTransactionNgrx.next();
    this.registerNewTransactionNgrx.complete();
    this.allChartsDatangrx.next();
    this.allChartsDatangrx.complete();
  }
}
