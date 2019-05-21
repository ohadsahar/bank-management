import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Bank } from '../../../shared/models/bank-data.model';
import { MatTableDataSource, Sort } from '@angular/material';
import { BankValues } from '../../../shared/models/bank.model';
import { BankTranscationService } from '../../services/bank-transcation.service';
import { MessageService } from '../../services/message.service';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-bank-managment',
  templateUrl: './bank-managment.component.html',
  styleUrls: ['./bank-managment.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BankManagmentComponent implements OnInit {
  public sortedData: Bank[];
  public allTranscations: Bank[];
  private updateTranscations = new Subject<Bank[]>();
  public bankTransaction = new BankValues('', '', '', null, '', '', '');
  constructor(
    private bankTranscationService: BankTranscationService,
    private messageService: MessageService
  ) {

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
      this.dataSource = new MatTableDataSource(this.allTranscations);
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  sortData(sort: Sort) {

    this.sortedData = this.allTranscations;
    console.log(sort);
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

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  registerNewTranscation() {
    if (this.validateNewTranscation()) {
    this.bankTranscationService.registerNewTranscation(this.bankTransaction).subscribe(response => {
            this.allTranscations.push(response.message);
            this.dataSource = new MatTableDataSource(this.allTranscations);
            this.resetValues();
        },
        error => {
          this.messageService.failedMessage(
            'ישנה בעיה בהוספת עסקה חדשה', 'סגור'
          );
        }
      );
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

    this.bankTransaction = new BankValues('', '', '', null, '', '', '');
  }



}
