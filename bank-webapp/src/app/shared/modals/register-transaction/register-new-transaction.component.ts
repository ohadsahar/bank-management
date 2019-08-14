import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as fromRoot from '../../../app.reducer';
import { ShareDataService } from '../../../core/services/share-data.service';
import * as transactionActions from '../../../store/actions/transaction.actions';
import { BankValues } from '../../models/bank.model';
import { LoginService } from './../../../core/services/login.service';
import { WebSocketService } from './../../../core/services/web-socket.service';
import { CardsModel } from './../../models/cards.model';
import { CategoriesModel } from './../../models/categories.model';
import { OptionModel } from './../../models/option.model';

@Component({

  selector: 'app-new-transaction',
  templateUrl: './register-new-transaction.component.html',
  styleUrls: ['./register-new-transaction.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class RegisterNewTransactionModalComponent implements OnInit {

  private date: string;
  private purchaseMonth: string;
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  public registerSubscribe$: Subject<void> = new Subject<void>();
  cards: CardsModel[] = [];
  options: OptionModel[];
  categories: CategoriesModel[];

  constructor(private loginService: LoginService, private shareDataService: ShareDataService,
    private webSocketService: WebSocketService, private store: Store<fromRoot.State>) { }
  public bankTransaction = new BankValues('', '', '', '', '', null, null, null, null, '', '', null, null);

  ngOnInit() {
    this.onLoadComponent();
  }
  onLoadComponent() {
    this.shareDataService.currentOptions.subscribe(response => {
      this.options = response as any;
      this.shareDataService.currentCategories.subscribe(data => {
        this.categories = data as any;
        this.shareDataService.currentCards.subscribe(cardsData => {
          this.cards = cardsData as any;
        });
      });
    });
  }
  submitRegister() {
    this.bankTransaction.name = this.myControl.value;
    if (this.validateNewTransaction()) {
      this.date = moment().format('LL');
      this.purchaseMonth = (moment().month()).toString();
      this.purchaseMonth = moment().month(this.purchaseMonth).format('MMMM');
      this.bankTransaction.purchaseDate = this.date;
      this.bankTransaction.monthPurchase = this.purchaseMonth;
      this.bankTransaction.numberofpayments = 1;
      this.bankTransaction.yearOfTransaction = moment(Date.now()).format('YYYY') as any;
      this.bankTransaction.username = this.loginService.getUsernameAndId().username;
      this.categories.push({ typeProduct: this.bankTransaction.typeProduct });
      this.options.push({ name: this.bankTransaction.name });
      // this.webSocketService.emit('before-create-transaction', this.bankTransaction);
      this.registerNewTransaction(this.bankTransaction);
      this.resetAfterRegister();
    }
    return false;
  }

  registerNewTransaction(result: any): void {
    this.store.dispatch(new transactionActions.RegisterTransaction(result));
    const dataToSubscribe = this.store.select(fromRoot.newTransactionData).pipe(takeUntil(this.registerSubscribe$))
      .subscribe((data) => {
        if (data.loaded) {
          this.webSocketService.emit('create-transaction', data.data);
          dataToSubscribe.unsubscribe();
        }
      }, (error) => {
        // this.messageService.failedMessage(error, 'Dismiss');
      });
  }

  resetAfterRegister() {
    this.myControl.reset();
    const cardName = this.bankTransaction.cardName;
    this.bankTransaction = new BankValues('', '', '', '', '', null, null, null, null, '', '', null, this.bankTransaction.billingDate);
    this.bankTransaction.cardName = cardName;
  }
  validateNewTransaction() {
    if (this.bankTransaction.cardName.trim() !== '') {
      return true;
    }
    return false;
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
  addBillingDate(billingDate: number): void {
    this.bankTransaction.billingDate = billingDate;
  }

}


