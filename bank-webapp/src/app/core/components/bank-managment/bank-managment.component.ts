import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, PageEvent, Sort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as lodash from 'lodash';
import * as moment from 'moment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { combineLatest, Observable, of, Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { RegisterNewTransactionModalComponent } from 'src/app/shared/modals/register-transaction/register-new-transaction.component';
import { CardsModel } from 'src/app/shared/models/cards.model';
import { fromMatPaginator, fromMatSort, paginateRows } from 'src/app/table-util';
import * as fromRoot from '../../../app.reducer';
import { Bank } from '../../../shared/models/bank-data.model';
import { BankValues } from '../../../shared/models/bank.model';
import * as transactionActions from '../../../store/actions/transaction.actions';
import { MessageService } from '../../services/message.service';
import { bottomSideItemTrigger, upSideItemTrigger } from './../../../shared/animations/bank-management/bank-management-animations.animations';
import { LoginService } from './../../services/login.service';
import { ShareDataService } from './../../services/share-data.service';
import { WebSocketService } from './../../services/web-socket.service';


type SortFn<U> = (a: U, b: U) => number;
interface PropertySortFns<U> {
  [prop: string]: SortFn<U>;
}

@Component({
  selector: 'app-bank-managment',
  templateUrl: './bank-managment.component.html',
  styleUrls: ['./bank-managment.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [upSideItemTrigger, bottomSideItemTrigger]
})
export class BankManagmentComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource;
  public allTransactions: Bank[];
  public originalTransactions: Bank[];
  options: string[] = [];
  private counter: number;
  public numberOfPayments: number;
  public editEnable: boolean;
  public updateAble: boolean;
  public isLoading: boolean;
  public dataToSubscribe: Subscription;
  public registerSubscribe$: Subject<void> = new Subject<void>();
  public updateTransaction$: Subject<void> = new Subject<void>();
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public editoptionsable: any = {};
  public deletedId: string;
  currentCash: number;
  displayedRows$: Observable<any[]>;
  totalRows$: Observable<number>;
  public sortEvents$: Observable<Sort>;
  public pageEvents$: Observable<PageEvent>;
  purchaseD: string;
  today: Date;
  monthDifference: number;
  endDate: string;
  public cancelBankEditTransaction = new BankValues('', '', '', '', '', null, null, null, null, '', '', null, null);
  public bankEditTransaction = new BankValues('', '', '', '', '', null, null, null, null, '', '', null, null);
  constructor(private messageService: MessageService, private store: Store<fromRoot.State>,
    public router: Router, public dialog: MatDialog, private loginService: LoginService,
    private spinnerService: Ng4LoadingSpinnerService, private shareDataService: ShareDataService,
    private webSocketService: WebSocketService) {
    this.isLoading = false;
    this.counter = 0;
    this.numberOfPayments = 0;
    this.editEnable = false;
    this.updateAble = false;
  }
  cards: CardsModel[] = [];
  categories: any[];

  ngOnInit() {
    this.onLoadSite();
  }
  onLoadSite(): void {
    this.loading();
    this.shareDataService.currentCashToPass.subscribe(response => {
      this.currentCash = response;
    });
    this.sortEvents$ = fromMatSort(this.sort);
    this.pageEvents$ = fromMatPaginator(this.paginator);
    this.getAllTransactions();
    this.startSocketing();
  }
  startSocketing() {
    this.webSocketService.listen('transaction-added').subscribe(response => {
      this.allTransactions.push(response.message);
      this.currentCash += Number((response.message.eachMonth).toFixed(2));
      this.afterRegisterNewCard();
    });
    this.webSocketService.listen('transaction-updated').subscribe(response => {
      const index = this.allTransactions.findIndex(transaction => transaction._id === response.message.bankData._id);
      this.allTransactions[index] = response.message.bankData;
      this.afterUpdate();
    });
    this.webSocketService.listen('transaction-removed').subscribe(response => {
      const deleteTransaction = this.allTransactions.filter(transaction => transaction._id !== response.message);
      this.allTransactions = deleteTransaction;
      this.afterDeleteTransaction();
    });
  }
  getAllTransactions(): void {
    const loggedInUsername = this.loginService.getUsernameAndId().username;
    this.store.dispatch(new transactionActions.GetAllTransactions(loggedInUsername));
    this.dataToSubscribe = this.store.select(fromRoot.fetchedTransaction).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data.loaded) {
          this.categories = data.data.groupOfCategories;
          this.options = data.data.groupOfbusiness;
          this.shareDataService.changeCategories(data.data.groupOfCategories);
          this.shareDataService.changeOptions(data.data.groupOfbusiness);
          this.shareDataService.changeCards(data.data.allCards);
          this.cards = data.data.allCards;
          this.allTransactions = data.data.foundTranscations;
          this.afterFetchedAllData();
        }
      }, (error) => {
        this.loaded();
        this.messageService.failedMessage(error, 'Dismiss');
      });
  }
  deleteTransaction(transactionId: string, eachMonth: number): void {
    console.log(eachMonth);
    this.loading();
    this.store.dispatch(new transactionActions.DeleteTransaction(transactionId));
    const dataToSubscribe = this.store.select(fromRoot.newTransactionData).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data.loaded) {
          this.currentCash -= eachMonth;
          this.deletedId = transactionId;
          this.webSocketService.emit('delete-transaction', data.data);
          dataToSubscribe.unsubscribe();
          this.loaded();
        }
      }, (error) => {
        this.loaded();
        this.messageService.failedMessage(error, 'Dismiss');
      });
  }
  updateTransaction(): void {
    this.loading();
    this.bankEditTransaction.purchaseDate = moment(this.bankEditTransaction.purchaseDate).format('DD/MM/YYYY');
    this.store.dispatch(new transactionActions.UpdateTransaction(this.bankEditTransaction));
    this.dataToSubscribe = this.store.select(fromRoot.newTransactionData).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data.loaded) {
          this.webSocketService.emit('update-transaction', data.data);
          this.dataToSubscribe.unsubscribe();
          this.loaded();
        }
      }, (error) => {
        this.loaded();
        this.messageService.failedMessage(error, 'Dismiss');
      });
  }
  afterFetchedAllData(): void {
    this.updateTable(this.allTransactions);
    this.loaded();
    this.dataToSubscribe.unsubscribe();
  }
  afterUpdate(): void {
    this.updateAble = false;
    this.messageService.successMessage('העסקה עודכנה בהצלחה', 'סגור');
    this.updateTable(this.allTransactions);
  }
  registerNewTransactionDialog(): void {
    this.dialog.open(RegisterNewTransactionModalComponent);
  }
  afterRegisterNewCard(): void {
    this.shareDataService.changeTransactions(this.allTransactions as any);
    this.messageService.successMessage('הקנייה התווספה בהצלחה', 'סגור');
    this.updateTable(this.allTransactions);
  }
  afterDeleteTransaction(): void {
    this.shareDataService.changeTransactions(this.allTransactions as any);
    this.messageService.successMessage('העסקה נמחקה בהצלחה', 'סגור');
    this.updateTable(this.allTransactions);
  }
  editTransaction(transactionData: Bank): void {
    this.updateAble = true;
    this.counter = this.counter + 1;
    this.cancelBankEditTransaction = Object.assign({}, transactionData);
    this.bankEditTransaction = transactionData;
    this.bankEditTransaction.username = this.loginService.getUsernameAndId().username;
    if (this.counter === 1) {
      this.editEnable = true;
    } else {
      this.counter = 0;
    }
  }
  cancelUpdate(): void {
    this.restoreData();
    this.updateAble = false;
    this.messageService.successMessage('עדכון העסקה בוטל', 'סגור');
  }
  restoreData() {
    this.bankEditTransaction.cardName = this.cancelBankEditTransaction.cardName;
    this.bankEditTransaction.name = this.cancelBankEditTransaction.name;
    this.bankEditTransaction.price = this.cancelBankEditTransaction.price;
    this.bankEditTransaction.typeProduct = this.cancelBankEditTransaction.typeProduct;
    this.bankEditTransaction.leftPayments = this.cancelBankEditTransaction.leftPayments;
    this.bankEditTransaction.eachMonth = this.cancelBankEditTransaction.eachMonth;
    this.bankEditTransaction.numberofpayments = this.cancelBankEditTransaction.numberofpayments;
    this.bankEditTransaction.purchaseDate = moment(this.bankEditTransaction.purchaseDate).format('DD/MM/YYYY');
  }
  updateTable(allTransactions: Bank[]): void {
    this.dataSource = new MatTableDataSource(allTransactions);
    const rows$ = of(allTransactions);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(this.sortRows(this.sortEvents$), paginateRows(this.pageEvents$));
  }
  calculateEachMonthEdit(): void {
    if (this.bankEditTransaction.numberofpayments) {
      this.bankEditTransaction.eachMonth = this.bankEditTransaction.price / this.bankEditTransaction.leftPayments;
      this.bankEditTransaction.eachMonth = Number(this.bankEditTransaction.eachMonth.toFixed(2));
    } else {
      this.bankEditTransaction.eachMonth = null;
      this.bankEditTransaction.leftPayments = null;
    }
    this.resetDate();
  }
  calculateDate($event) {
    this.purchaseD = moment($event).format('DD/MM/YYYY');
    this.today = new Date();
    this.endDate = moment(this.purchaseD).add(this.bankEditTransaction.numberofpayments, 'months').format('DD/MM/YYYY');
    this.monthDifference = moment(this.today).diff(this.purchaseD, 'M');
    this.bankEditTransaction.numberofpayments = this.monthDifference + 1;
  }
  resetDate(): void {
    this.endDate = null;
    this.today = null;
    this.purchaseD = null;
    this.monthDifference = 0;
  }
  loading(): void {
    this.isLoading = true;
    this.spinnerService.show();
  }
  loaded(): void {
    this.isLoading = false;
    this.spinnerService.hide();
  }
  applyFilter(filterValue: string): void {
    if (filterValue.length > 0) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.currentCash = lodash(this.dataSource.filteredData).sumBy('eachMonth');
      this.updateTable(this.dataSource.filteredData);
    } else {
      this.shareDataService.currentCashToPass.subscribe(response => {
        this.currentCash = Number((response).toFixed(2));
      }, (error) => {
        this.messageService.failedMessage(error, 'Dismiss');
      });
      this.updateTable(this.allTransactions);
    }
  }
  sortRows<U>(
    sort$: Observable<Sort>,
    sortFns: PropertySortFns<U> = {},
    useDefault = true
  ): (obs$: Observable<U[]>) => Observable<U[]> {
    return (rows$: Observable<U[]>) => combineLatest(
      rows$,
      sort$.pipe(this.toSortFn(sortFns, useDefault)),
      (rows, sortFn) => {
        if (!sortFn) { return rows; }

        const copy = rows.slice();
        return copy.sort(sortFn);
      }
    );
  }
  toSortFn<U>(sortFns: PropertySortFns<U> = {}, useDefault = true): (sort$: Observable<Sort>) => Observable<undefined | SortFn<U>> {
    return (sort$) => sort$.pipe(
      map(sort => {
        if (!sort.active || sort.direction === '') { return undefined; }

        let sortFn = sortFns[sort.active];
        if (!sortFn) {
          if (!useDefault) {
            throw new Error(`Unknown sort property [${sort.active}]`);
          }
          sortFn = (a: U, b: U) => this.defaultSort((a as any)[sort.active], (b as any)[sort.active]);
        }
        return sort.direction === 'asc' ? sortFn : (a: U, b: U) => sortFn(b, a);
      })
    );
  }
  defaultSort(a: any, b: any): number {
    a = a === undefined ? null : a;
    b = b === undefined ? null : b;
    if (a === b) { return 0; }
    if (a === null) { return -1; }
    if (b === null) { return 1; }
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  }
  ngOnDestroy() {
    this.registerSubscribe$.complete();
    this.registerSubscribe$.unsubscribe();
    this.updateTransaction$.complete();
    this.updateTransaction$.unsubscribe();
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe.unsubscribe();
  }
}

