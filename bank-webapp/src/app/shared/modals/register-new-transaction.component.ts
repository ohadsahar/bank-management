import { Component, Inject, OnInit } from '@angular/core';
import { BankValues } from '../models/bank.model';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { startWith, map } from 'rxjs/operators';

@Component({

  selector: 'app-new-transaction',
  templateUrl: './register-new-transaction.component.html',
  styleUrls: ['./register-new-transaction.component.css']
})

export class RegisterNewTransactionModalComponent implements OnInit {

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  options: string[] = ['רנואר', 'קאסטרו', 'אייבורי'];
  cards: any[] = [{ value: 'הוט' }, { value: 'שופרסל' }, { value: 'נגב' }, { value: 'יוניק' },
  { value: 'דרים קארד' }, { value: 'מאסטר-קארד אוהד' }, { value: 'דרים קארד אוהד' }];
  categories: any[] = [{ value: 'חשמל' }, { value: 'ביגוד' }, { value: 'ריהוט' },
  { value: 'אוכל' }, { value: 'תכשיטים' }, { value: 'בריאות' }, { value: 'אחר' }];

  constructor() { }
  public bankTransaction = new BankValues('', '', '', '', null, null, null, null, '', '');


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
      const date = moment(Date.now()).calendar().toString();
      const purchaseMonth = moment(Date.now()).month().toString();
      this.bankTransaction.purchaseDate = date + 1;
      this.bankTransaction.monthPurchase = purchaseMonth;
    }
  }

  validateNewTransaction() {

    if (this.bankTransaction.cardName && this.bankTransaction.name &&
      this.bankTransaction.price && this.bankTransaction.typeProduct) {
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
