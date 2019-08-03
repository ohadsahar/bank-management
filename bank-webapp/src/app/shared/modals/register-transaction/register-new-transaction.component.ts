import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ShareDataService } from '../../../core/services/share-data.service';
import { BankValues } from '../../models/bank.model';
import { LoginService } from './../../../core/services/login.service';
import { WebSocketService } from './../../../core/services/web-socket.service';
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

  cards: any[] = [{ value: 'הוט' }, { value: 'שופרסל' }, { value: 'נגב' }, { value: 'יוניק' },
  { value: 'דרים קארד' }, { value: 'מאסטר-קארד אוהד' }, { value: 'דרים קארד אוהד' }, { value: 'לייף סטייל' }];
  options: OptionModel[];
  categories: CategoriesModel[];

  constructor(private loginService: LoginService, private shareDataService: ShareDataService,
    private webSocketService: WebSocketService) { }
  public bankTransaction = new BankValues('', '', '', '', '', null, null, null, null, '', '', null);

  ngOnInit() {
    this.onLoadComponent();
  }
  onLoadComponent() {
    this.shareDataService.currentOptions.subscribe(response => {
      this.options = response as any;
      this.shareDataService.currentCategories.subscribe(data => {
        this.categories = data as any;
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
      this.bankTransaction.yearOfTransaction = moment(Date.now()).format('YYYY') as any;
      this.bankTransaction.username = this.loginService.getUsernameAndId().username;
      this.categories.push({ typeProduct: this.bankTransaction.typeProduct });
      this.options.push({ name: this.bankTransaction.name });
      this.webSocketService.emit('create-transaction', this.bankTransaction);
      this.resetAfterRegister();
    }
    return false;
  }
  resetAfterRegister() {
    this.myControl.reset();
    const cardName = this.bankTransaction.cardName;
    this.bankTransaction = new BankValues('', '', '', '', '', null, null, null, null, '', '', null);
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
}


