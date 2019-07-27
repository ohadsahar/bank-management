import { LoginService } from './../../../core/services/login.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BankValues } from '../../models/bank.model';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { startWith, map } from 'rxjs/operators';

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
  options: string[] = [
    'ממתקים', 'יס פלנט', 'סופר פארם', 'הגראז', 'קמפאי', 'פאנקו פופ', 'דלק', 'רנואר', 'קאסטרו', 'אייבורי'];
  cards: any[] = [{ value: 'הוט' }, { value: 'שופרסל' }, { value: 'נגב' }, { value: 'יוניק' },
  { value: 'דרים קארד' }, { value: 'מאסטר-קארד אוהד' }, { value: 'דרים קארד אוהד' }, { value: 'לייף סטייל' }];
  categories: any[] = [{ value: 'חשמל' }, { value: 'ביגוד' }, { value: 'ריהוט' },
  { value: 'אוכל' }, { value: 'תכשיטים' }, { value: 'בריאות' }, { value: 'חו"ל' }, { value: 'רכבת ישראל' },
  { value: 'ביטוח' }, { value: 'רכב' }, { value: 'משיכת מזומן' }, { value: 'מספרה' }, { value: 'תחבורה ציבורית' },
  { value: 'מרכז קניות' }, { value: 'אחר' }];



  constructor(private loginService: LoginService) { }
  public bankTransaction = new BankValues('', '', '', '', '', null, null, null, null, '', '');

  ngOnInit() {
    this.onLoadComponent();
  }
  onLoadComponent() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  submitRegister() {
    this.bankTransaction.name = this.myControl.value;
    if (this.validateNewTransaction()) {
      this.date = moment().format('LL');
      this.purchaseMonth = (moment().month()).toString();
      this.purchaseMonth = moment().month(this.purchaseMonth).format('MMMM');
      this.bankTransaction.purchaseDate = this.date;
      this.bankTransaction.monthPurchase = this.purchaseMonth;
      this.bankTransaction.username = this.loginService.getUsernameAndId().username;
    }
    return false;
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
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }


}
