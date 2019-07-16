import { LoginService } from './../../services/login.service';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Chart } from 'chart.js';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

import * as fromRoot from '../../../app.reducer';
import { Bank } from '../../../shared/models/bank-data.model';
import { BankValues } from '../../../shared/models/bank.model';
import { ChartByCardName } from '../../../shared/models/chart-by-cardname.model';
import * as chartActions from '../../../store/actions/chart.actions';
import * as transactionActions from '../../../store/actions/transaction.actions';
import { BankTranscationService } from '../../services/bank-transcation.service';
import { MessageService } from '../../services/message.service';
import { PaymentTransactionArchiveService } from '../../services/payment-transaction.service';
import { RegisterNewTransactionModalComponent } from 'src/app/shared/modals/register-transaction/register-new-transaction.component';

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
  public allTransactions: Bank[];
  public chartTransactions: ChartByCardName[];
  public chartByMonthTransactions: any[];
  public arrayCardsNames: string[] = [];
  public arrayCardsTotalPrice: number[] = [];
  public arrayExpansesEachMonth: number[] = [];
  public arrayEachMonthData: string[] = [];
  options: string[] = ['הספרייה', 'רנואר', 'קאסטרו', 'אייבורי'];
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
  public eachMonthExpenses: Chart;
  public loading: boolean;
  public loaded: boolean;
  public archiveTransactions: Bank[];
  public dataToSubscribe: Subscription;
  private getCharts$: Subject<void> = new Subject<void>();
  public registerNewTransactionNgrx: Subject<void> = new Subject<void>();
  public updateTransaction$: Subject<void> = new Subject<void>();
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private archiveTransaction$: Subject<void> = new Subject<void>();
  public editoptionsable: any = {};
  public bankEditTransaction = new BankValues('', '', '', '', '', null, null, null, null, '', '');
  constructor(
    private bankTransactionService: BankTranscationService,
    private messageService: MessageService,
    private paymentService: PaymentTransactionArchiveService,
    private store: Store<fromRoot.State>,
    public router: Router,
    public dialog: MatDialog,
    private loginService: LoginService
  ) {
    this.counter = 0;
    this.totalExpenses = 0;
    this.monthExpenses = 0;
    this.numberOfPayments = 0;
    this.editEnable = false;
    this.updateAble = false;
  }
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [
    'id', 'cardName', 'name', 'type', 'price', 'numberofpayments', 'eachMonth', 'leftPayments', 'purchaseDate'
  ];
  cards: any[] = [{ value: 'הוט' }, { value: 'שופרסל' }, { value: 'נגב' }, { value: 'יוניק' },
  { value: 'דרים קארד' }, { value: 'מאסטר-קארד אוהד' }, { value: 'דרים קארד אוהד' }];
  categories: any[] = [{ value: 'חשמל' }, { value: 'ביגוד' }, { value: 'ריהוט' },
  { value: 'אוכל' }, { value: 'תכשיטים' }, { value: 'בריאות' }, { value: 'אחר' }];


  ngOnInit() {
    this.onLoadSite();
  }
  onLoadSite(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.getAllTransactions();
  }
  getAllTransactions(): void {
    const loggedInUsername = this.loginService.getUsernameAndId().username;
    this.store.dispatch(new transactionActions.GetAllTransactions(loggedInUsername));
    this.dataToSubscribe = this.store.select(fromRoot.newTransactionData).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data.loaded) {
          this.arrayCardsNames = data.data.chartGroupByCardName;
          this.allTransactions = data.data.foundTranscations;
          this.chartByMonthTransactions = data.data.chartGroupByMonth;
          this.afterFetchedAllData();
        }
      });
  }
  getAllCharts(): void {
    this.store.dispatch(new chartActions.GetCharts(this.loginService.getUsernameAndId().username));
    this.store.select(fromRoot.getChartsData).pipe(takeUntil(this.getCharts$))
      .subscribe((data) => {
        if (data.loaded) {
          this.chartTransactions = data.data.chartGroupByCardName;
          this.chartByMonthTransactions = data.data.chartGroupByMonth;
          this.assignDataToCharts();
        }
      });
  }
  registerNewTransaction(result: any): void {
    this.store.dispatch(new transactionActions.RegisterTransaction(result));
    this.dataToSubscribe = this.store.select(fromRoot.newTransactionData).pipe(takeUntil(this.registerNewTransactionNgrx))
      .subscribe((data) => {
        if (data.loaded) {
          this.allTransactions.push(data.data);
          this.afterRegisterNewCard();
          this.dataToSubscribe.unsubscribe();
        }
      });
  }
  deleteTransaction(transactionId: string): void {
    this.store.dispatch(new transactionActions.DeleteTransaction(transactionId));
    this.dataToSubscribe = this.store.select(fromRoot.newTransactionData).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data.data) {
          const dataId = data.data.toString();
          const deleteTransaction = this.allTransactions.filter(transaction => transaction._id !== dataId);
          this.allTransactions = deleteTransaction;
          this.afterDeleteTransaction();
          this.messageService.successMessage('העסקה נמחקה בהצלחה','סגור');
          this.dataToSubscribe.unsubscribe();
        }
      });
  }
  updateTransaction(): void {
    this.store.dispatch(new transactionActions.UpdateTransaction(this.bankEditTransaction));
    this.dataToSubscribe = this.store.select(fromRoot.newTransactionData).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data.data) {
          const index = this.allTransactions.findIndex(transaction => transaction._id === data.data._id);
          this.allTransactions[index] = data.data;
          this.afterUpdate();
          this.dataToSubscribe.unsubscribe();
        }
      });
  }
  // Help functions
  afterFetchedAllData(): void {
    this.updateTable();
    this.getAllCharts();
    this.dataToSubscribe.unsubscribe();
  }
  afterUpdate(): void {
    this.updateAble = false;
    this.messageService.successMessage('העסקה עודכנה בהצלחה', 'סגור');
    this.destroyCharts();
  }
  registerNewTransactionDialog(): void {
    const dialogRef = this.dialog.open(RegisterNewTransactionModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.registerNewTransaction(result);
      }
    });
  }
  afterRegisterNewCard(): void {
    this.chartTransactions = this.allTransactions;
    this.messageService.successMessage('הקנייה התווספה בהצלחה', 'סגור');
    this.updateTable();
    this.destroyCharts();

  }
  afterDeleteTransaction(): void {
    this.chartTransactions = this.allTransactions;
    this.messageService.successMessage('העסקה נמחקה בהצלחה', 'סגור');
    this.updateTable();
    this.destroyCharts();
  }
  editTransaction(transactionData: Bank): void {
    this.updateAble = true;
    this.counter = this.counter + 1;
    this.bankEditTransaction = transactionData;
    this.bankEditTransaction.username = this.loginService.getUsernameAndId().username;
    if (this.counter === 1) {
      this.editEnable = true;
    } else {
      this.counter = 0;
    }
  }
  cancelUpdate(data) {

    this.bankTransactionService.getTransactionById(data._id).subscribe(response => {
      this.bankEditTransaction = response.message;
    })
    this.updateAble = false;
    this.messageService.successMessage('עדכון העסקה בוטל','סגור');
  }
  updateTable(): void {
    this.dataSource = new MatTableDataSource(this.allTransactions);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  assignDataToCharts(): void {
    this.arrayCardsTotalPrice = [];
    this.arrayCardsNames = [];
    this.arrayExpansesEachMonth = [];
    this.arrayEachMonthData = [];
    this.chartTransactions.forEach(transactionData => {
      this.arrayCardsNames.push(transactionData.cardName);
      this.arrayCardsTotalPrice.push(transactionData.price);
    });
    this.chartByMonthTransactions.forEach(element => {
      this.arrayExpansesEachMonth.push(element.monthPurchase);
      this.arrayEachMonthData.push(element.price);
    });
    this.loadCharts();
  }
  loadCharts(): void {
    this.cardsChart('pie');
    this.eachMonthChartDisplay('bar');
  }
  eachMonthChartDisplay(type: string): void {
    this.eachMonthExpenses = new Chart('eachMonthExpenses', {
      type,
      data: {
        datasets: [{
          label: 'לפי חודשים',
          data: this.arrayEachMonthData,
          backgroundColor: ['#fbd0c6', '#f6c1a6', '#c8c87a', '#79c0b0', '#7ec2a3', '#65b6bd',
            '#70a6ca', '#90b4cb']
        },],

        labels: this.arrayExpansesEachMonth,
      },
      options: {
        scales: {
          xAxes: [{
            stacked: true,
            barThickness: 8,
            maxBarThickness: 10,

          }],
          yAxes: [{
            stacked: true,
            barThickness: 8,
            maxBarThickness: 10,

          }]
        },
        animation: false,
      }
    });
  }
  cardsChart(type: string): void {
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
      options: {
        animation: false,
      }
    });
  }
  destroyCharts(): void {
    this.allCardChart.destroy();
    this.eachMonthExpenses.destroy();
    this.getAllCharts();
  }
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }
  sortData(sort: Sort) {
    this.sortedData = this.allTransactions;
    const data = this.allTransactions.slice();
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
    this.allTransactions = this.sortedData;
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  calculateEachMonthEdit(): void {
    if (this.bankEditTransaction.numberofpayments) {
      this.bankEditTransaction.eachMonth = this.bankEditTransaction.price / this.bankEditTransaction.numberofpayments;
      this.bankEditTransaction.eachMonth = Number(this.bankEditTransaction.eachMonth.toFixed(2));
      this.bankEditTransaction.leftPayments = this.bankEditTransaction.numberofpayments;
    } else {
      this.bankEditTransaction.eachMonth = null;
      this.bankEditTransaction.leftPayments = null;
    }
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  // End of help functions
  ngOnDestroy() {
    this.registerNewTransactionNgrx.unsubscribe();
    this.getCharts$.unsubscribe();
    this.ngUnsubscribe.unsubscribe();
  }
}

