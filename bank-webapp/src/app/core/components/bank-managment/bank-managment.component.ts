import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { Store } from '@ngrx/store';
import { Chart } from 'chart.js';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { RegisterNewTransactionModalComponent } from 'src/app/shared/modals/register-new-transaction.component';
import * as fromRoot from '../../../app.reducer';
import { Bank } from '../../../shared/models/bank-data.model';
import { BankValues } from '../../../shared/models/bank.model';
import { ChartByCardName } from '../../../shared/models/chart-by-cardname.model';
import * as chartActions from '../../../store/actions/chart.actions';
import * as transactionActions from '../../../store/actions/transaction.actions';
import { BankTranscationService } from '../../services/bank-transcation.service';
import { MessageService } from '../../services/message.service';


@Component({
  selector: 'app-bank-managment',
  templateUrl: './bank-managment.component.html',
  styleUrls: ['./bank-managment.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BankManagmentComponent implements OnInit, OnDestroy {

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
  public allCardChart: Chart;
  public allExpensesByMonthChart: Chart;
  public loading: boolean;
  public loaded: boolean;
  private getCharts$: Subject<void> = new Subject<void>();
  public registerNewTransactionNgrx: Subject<void> = new Subject<void>();
  public updateTransaction$: Subject<void> = new Subject<void>();
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public editoptionsable: any = {};
  public bankEditTransaction = new BankValues('', '', '', '', null, null, null, null, '', '');
  constructor(
    private bankTransactionService: BankTranscationService,
    private messageService: MessageService,
    private store: Store<fromRoot.State>,
    public dialog: MatDialog
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
      this.arrayCardsNames = response.message.chartGroupByCardName;
      this.allTranscations = response.message.foundTranscations;
      this.updateTable();
      this.calculateFinancialExpenses();
      this.getAllCharts();
    });
    // this.store.dispatch(new transactionActions.GetAllTransactions());
    // this.store.select(fromRoot.newTransactionData).pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe((data) => {
    //     if (data.loaded) {
    //       console.log(data.data);
    //       // this.updateTable();
    //       // this.calculateFinancialExpenses();
    //       // this.getAllCharts();
    //     }
    //   });
  }
  getAllCharts() {
    this.store.dispatch(new chartActions.GetCharts());
    this.store.select(fromRoot.getChartsData).pipe(takeUntil(this.getCharts$))
      .subscribe((data) => {
        if (data.loaded) {
          this.chartTranscations = data.data as any;
          this.assignCardNames();
        }
      });
  }
  registerNewTransaction(result: any) {
    this.store.dispatch(new transactionActions.RegisterTransaction(result));
    this.store.select(fromRoot.newTransactionData).pipe(takeUntil(this.registerNewTransactionNgrx))
      .subscribe((data) => {
        if (data.loaded) {
          this.afterRegisterNewCard(data.data);
          this.messageService.successMessage('הקנייה התווספה בהצלחה', 'סגור');
        }
      });
  }
  deleteTransaction(transactionId: string, transactionData: Bank) {

    this.store.dispatch(new transactionActions.DeleteTransaction(transactionId));
    this.store.select(fromRoot.newTransactionData).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data.data) {
          const dataId = data.data.toString();
          const deleteTransaction = this.allTranscations.filter(transaction => transaction._id !== dataId);
          this.allTranscations = deleteTransaction;
          this.updateFinancialExpensesAfterDelete(transactionData);
          this.updateTable();
        }
      });
  }
  updateTransaction() {
    this.bankTransactionService.updateTransaction(this.bankEditTransaction).subscribe(response => {
      const index = this.allTranscations.findIndex(transaction => transaction._id === response.message.bankData._id);
      this.allTranscations[index] = response.message.bankData;
      this.updateAble = false;
    });
    // console.log(this.bankEditTransaction);
    // this.store.dispatch(new transactionActions.UpdateTransaction(this.bankEditTransaction));
    // this.store.select(fromRoot.newTransactionData).pipe(takeUntil(this.updateTransaction$))
    //   .subscribe((data) => {
    //     const index = this.allTranscations.findIndex(transaction => transaction._id === data._id);
    //     this.allTranscations[index] = data.data;
    //     this.updateAble = false;
    //   });
  }
  assignCardNames() {
    this.arrayCardsTotalPrice = [];
    this.arrayCardsNames = [];
    this.chartTranscations.forEach(transactionData => {
      this.arrayCardsNames.push(transactionData.cardName);
      this.arrayCardsTotalPrice.push(transactionData.price);
    });
    this.loadCharts();
  }
  loadCharts() {
    this.cardsChart('pie');
    this.expensesByCurrentMonthChart('bar');
  }

  expensesByCurrentMonthChart(type: string) {
    this.allExpensesByMonthChart = new Chart('allExpensesByMonthChart', {
      type,
      data: {
        datasets: [{
          label: 'החודש הנוכחי',
          data: this.arrayCardsTotalPrice
        },],

        labels: this.arrayCardsNames,
      },
      options: {
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true
          }]
        }
      }
    });
  }
  cardsChart(type: string) {
    this.allCardChart = new Chart('allCardChart', {
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
  changeChart(type: string) {
    if (this.allCardChart) {
      this.allCardChart.destroy();
    } else {
      this.allCardChart(type);
    }
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  registerNewTransactionDialog() {
    const dialogRef = this.dialog.open(RegisterNewTransactionModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.registerNewTransaction(result);
      }
    });
  }
  ngOnDestroy() {
    this.getCharts$.complete();
    this.registerNewTransactionNgrx.complete();
    this.registerNewTransactionNgrx.unsubscribe();
    this.getCharts$.unsubscribe();
  }

}
