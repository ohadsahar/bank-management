import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { Router } from '@angular/router';
import { Bank } from '../../../shared/models/bank-data.model';
import { PaymentTransactionArchiveService } from '../../services/payment-transaction.service';
@Component({
  selector: 'app-payment-management',
  templateUrl: './payment-management.component.html',
  styleUrls: ['./payment-management.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class PaymentManagementComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public sortedData: Bank[];
  public allTransactions: Bank[];
  myControl = new FormControl();
  public loading: boolean;
  public loaded: boolean;
  constructor(
    private paymentService: PaymentTransactionArchiveService,
    public router: Router,
    public dialog: MatDialog
  ) {
  }
  dataSource = new MatTableDataSource();
  dataSourceOldTransactions = new MatTableDataSource();
  displayedColumns: string[] = [
    'id', 'cardName', 'name', 'type', 'price', 'numberofpayments', 'eachMonth', 'leftPayments', 'purchaseDate'
  ];
  ngOnInit() {
    this.onLoadSite();
  }
  onLoadSite(): void {
    this.getAllTransactions();
  }
  getAllTransactions(): void {
    this.paymentService.getAllArchiveTransactions().subscribe(response => {
      this.allTransactions = response.message.archivesTransactions;
      this.updateTable();
    });
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
  updateTable(): void {
    this.dataSource = new MatTableDataSource(this.allTransactions);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


}


