import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as fromRoot from '../../../app.reducer';
import { Bank } from '../../../shared/models/bank-data.model';
import * as transactionActions from '../../../store/actions/transaction.actions';
import { LoginService } from './../../services/login.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-payment-management',
  templateUrl: './payment-management.component.html',
  styleUrls: ['./payment-management.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class PaymentManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public sortedData: Bank[];
  public allTransactions: Bank[];
  myControl = new FormControl();
  public isLoading: boolean;
  public dataToSubscribe: Subscription;
  public ngbSubscribe: Subject<void> = new Subject<void>();
  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    public router: Router,
    public dialog: MatDialog,
    public loginService: LoginService,
    private store: Store<fromRoot.State>
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
    const username = this.loginService.getUsernameAndId().username;
    this.store.dispatch(new transactionActions.GetAllArchiveTransactions(username));
    this.dataToSubscribe = this.store.select(fromRoot.fetchedTransaction).pipe(takeUntil(this.ngbSubscribe))
      .subscribe((data) => {
        if (data.loaded) {
          this.allTransactions = data.data.archivesTransactions;
          this.updateTable();
          this.dataToSubscribe.unsubscribe();
        }
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
  startLoading() {
    this.isLoading = true;
    this.spinnerService.show();
  }

  stopLoading() {
    this.isLoading = false;
    this.spinnerService.hide();
  }

}


