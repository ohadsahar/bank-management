import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Bank } from '../../../shared/models/bank-data.model';
import { MatTableDataSource, Sort, MatPaginator, MatSort } from '@angular/material';
import { BankValues } from '../../../shared/models/bank.model';
import { BankTranscationService } from '../../services/bank-transcation.service';
import { MessageService } from '../../services/message.service';
import * as moment from 'moment';




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
  public totalExpenses: number;
  public monthExpenses: number;
  public editEnable: boolean;
  public editoptionsable: any = {};
  public numberOfPayments: number;
  public bankTransaction = new BankValues('', '', '', '', null, null, null, null, '');
  constructor(
    private bankTranscationService: BankTranscationService,
    private messageService: MessageService
  ) {
        this.totalExpenses = 0;
        this.monthExpenses = 0;
        this.numberOfPayments = 0;
        this.editEnable = false;
  }


  displayedColumns: string[] = [
    'cardName',
    'name',
    'type',
    'price',
    'numberofpayments',
    'eachMonth',
    'leftPayments'
  ];
  dataSource = new MatTableDataSource();

  ngOnInit() {
    this.onLoadSite();
  }
  onLoadSite() {
    this.getAllTranscations();

  }
  getAllTranscations() {
    this.bankTranscationService.getTranscations().subscribe(response => {
      this.allTranscations = response.message as any;
      this.updateTable();
      this.calculateFinancialExpenses();
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
  calculateFinancialExpenses() {
    this.allTranscations.forEach(transcation => {
      this.totalExpenses += transcation.price;
      if (transcation.leftPayments > 0) {
        this.numberOfPayments += transcation.leftPayments;
        this.monthExpenses += transcation.eachMonth;
      }
    });
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  registerNewTranscation() {
    if (this.validateNewTranscation()) {
    const date = moment(Date.now()).format('LL').toString();
    this.bankTransaction.purchaseDate = date;
    this.bankTranscationService.registerNewTranscation(this.bankTransaction).subscribe(response => {
            this.allTranscations.push(response.message);
            this.updateTable();
            this.updateFinancialExpensesAfterRegister(response);
            this.resetValues();
            this.messageService.successMessage('הקנייה התווספה בהצלחה', 'סגור');
        },
        error => {
          this.messageService.failedMessage(
            'ישנה בעיה בהוספת עסקה חדשה', 'סגור'
          );
        }
      );
  }
}
  updateTable() {
    this.dataSource = new MatTableDataSource(this.allTranscations);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  editAble(transcationId: string) {
    this.editEnable = true;

  }
  deleteTranscation(transcationId: string, trancsationData: Bank) {
      this.bankTranscationService.deleteTranscation(transcationId).subscribe(response => {
      const deleteTranscation = this.allTranscations.filter(transcation => transcation._id !== transcationId);
      this.allTranscations = deleteTranscation;
      this.updateFinancialExpensesAfterDelete(trancsationData);
      this.updateTable();

    });
  }
  updateFinancialExpensesAfterDelete(trancsationData: Bank) {

    this.totalExpenses -= trancsationData.price;
    if (trancsationData.numberofpayments > 0) {
      this.numberOfPayments -= trancsationData.numberofpayments;
      this.monthExpenses -= trancsationData.eachMonth;
    }
  }
  updateFinancialExpensesAfterRegister(response) {

    this.totalExpenses += response.message.price;
    if (response.message.numberofpayments > 0) {
      this.numberOfPayments += response.message.numberofpayments;
      this.monthExpenses += response.message.eachMonth;
    }
  }
  validateNewTranscation() {

    if (this.bankTransaction.cardName && this.bankTransaction.name &&
      this.bankTransaction.price &&  this.bankTransaction.typeProduct) {
        return true;
      }
    return false;
  }
  resetValues() {

    this.bankTransaction = new BankValues('', '', '', '', null, null, null, null, '');
  }

}
