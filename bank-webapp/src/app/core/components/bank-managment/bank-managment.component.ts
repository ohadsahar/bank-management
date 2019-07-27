import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { RegisterNewTransactionModalComponent } from 'src/app/shared/modals/register-transaction/register-new-transaction.component';
import * as fromRoot from '../../../app.reducer';
import { Bank } from '../../../shared/models/bank-data.model';
import { BankValues } from '../../../shared/models/bank.model';
import * as transactionActions from '../../../store/actions/transaction.actions';
import { MessageService } from '../../services/message.service';
import {
  bottomSideItemTrigger,
  upSideItemTrigger
} from './../../../shared/animations/bank-management/bank-management-animations.animations';
import { LoginService } from './../../services/login.service';
import { ShareDataService } from './../../services/share-data.service';

@Component({
  selector: 'app-bank-managment',
  templateUrl: './bank-managment.component.html',
  styleUrls: ['./bank-managment.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [upSideItemTrigger, bottomSideItemTrigger]
})
export class BankManagmentComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public sortedData: Bank[];
  public allTransactions: Bank[];
  options: string[] = ['הספרייה', 'רנואר', 'קאסטרו', 'אייבורי'];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();
  private counter: number;
  public numberOfPayments: number;
  public editEnable: boolean;
  public updateAble: boolean;
  public isLoading: boolean;
  public loading: boolean;
  public loaded: boolean;
  public dataToSubscribe: Subscription;
  public registerNewTransactionNgrx: Subject<void> = new Subject<void>();
  public updateTransaction$: Subject<void> = new Subject<void>();
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public editoptionsable: any = {};
  public cancelBankEditTransaction = new BankValues('', '', '', '', '', null, null, null, null, '', '');
  public bankEditTransaction = new BankValues('', '', '', '', '', null, null, null, null, '', '');
  constructor(private messageService: MessageService, private store: Store<fromRoot.State>,
    public router: Router, public dialog: MatDialog, private loginService: LoginService,
    private spinnerService: Ng4LoadingSpinnerService, private shareDataService: ShareDataService) {
    this.isLoading = true;
    this.counter = 0;
    this.numberOfPayments = 0;
    this.editEnable = false;
    this.updateAble = false;
  }
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [
    'id', 'cardName', 'name', 'type', 'price', 'numberofpayments', 'eachMonth', 'leftPayments', 'purchaseDate'
  ];
  cards: any[] = [{ value: 'הוט' }, { value: 'שופרסל' }, { value: 'נגב' }, { value: 'יוניק' },
  { value: 'דרים קארד' }, { value: 'מאסטר-קארד אוהד' }, { value: 'דרים קארד אוהד' }, { value: 'לייף - סטייל' }];
  categories: any[] = [{ value: 'חשמל' }, { value: 'ביגוד' }, { value: 'ריהוט' },
  { value: 'אוכל' }, { value: 'תכשיטים' }, { value: 'בריאות' }, { value: 'חו"ל' }, { value: 'רכבת ישראל' },
  { value: 'ביטוח' }, { value: 'רכב' }, { value: 'משיכת מזומן' }, { value: 'מספרה' }, { value: 'תחבורה ציבורית' },
  { value: 'מרכז קניות' }, { value: 'אחר' }];


  ngOnInit() {
    this.onLoadSite();
  }
  onLoadSite(): void {
    this.isLoading = true;
    this.spinnerService.show();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.getAllTransactions();
  }
  getAllTransactions(): void {
    const loggedInUsername = this.loginService.getUsernameAndId().username;
    this.store.dispatch(new transactionActions.GetAllTransactions(loggedInUsername));
    this.dataToSubscribe = this.store.select(fromRoot.fetchedTransaction).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data.loaded) {
          this.spinnerService.hide();
          this.loading = false;
          this.allTransactions = data.data.foundTranscations;
          this.afterFetchedAllData();
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
          this.messageService.successMessage('העסקה נמחקה בהצלחה', 'סגור');
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
  afterFetchedAllData(): void {
    this.updateTable();
    this.isLoading = false;
    this.dataToSubscribe.unsubscribe();
  }
  afterUpdate(): void {
    this.updateAble = false;
    this.messageService.successMessage('העסקה עודכנה בהצלחה', 'סגור');
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

    this.shareDataService.changeTransactions(this.allTransactions as any);
    this.messageService.successMessage('הקנייה התווספה בהצלחה', 'סגור');
    this.updateTable();
    this.shareDataService.changeDestroy(true);

  }
  afterDeleteTransaction(): void {
    this.shareDataService.changeTransactions(this.allTransactions as any);
    this.messageService.successMessage('העסקה נמחקה בהצלחה', 'סגור');
    this.updateTable();
    this.shareDataService.changeDestroy(true);
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
  }
  updateTable(): void {
    this.dataSource = new MatTableDataSource(this.allTransactions);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    this.updateTable();
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
  ngOnDestroy() {
    this.registerNewTransactionNgrx.unsubscribe();
    this.ngUnsubscribe.unsubscribe();
  }
}

