import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, PageEvent, Sort } from '@angular/material';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { combineLatest, Observable, of, Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { fromMatPaginator, fromMatSort, paginateRows } from 'src/app/table-util';
import * as fromRoot from '../../../app.reducer';
import { Bank } from '../../../shared/models/bank-data.model';
import * as transactionActions from '../../../store/actions/transaction.actions';
import { LoginService } from './../../services/login.service';
import { MessageService } from './../../services/message.service';

type SortFn<U> = (a: U, b: U) => number;
interface PropertySortFns<U> {
  [prop: string]: SortFn<U>;
}

@Component({
  selector: 'app-payment-management',
  templateUrl: './payment-management.component.html',
  styleUrls: ['./payment-management.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class PaymentManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public sortedData: Bank[];
  public allTransactions: Bank[];
  myControl = new FormControl();
  public dataToSubscribe: Subscription;
  public ngbSubscribe: Subject<void> = new Subject<void>();
  displayedRows$: Observable<any[]>;
  totalRows$: Observable<number>;
  public sortEvents$: Observable<Sort>;
  public pageEvents$: Observable<PageEvent>;
  isLoading: boolean;
  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    public router: Router,
    public dialog: MatDialog,
    private messageService: MessageService,
    public loginService: LoginService,
    private store: Store<fromRoot.State>
  ) {
    this.isLoading = false;
  }

  ngOnInit() {
    this.onLoadSite();
  }
  onLoadSite(): void {
    this.sortEvents$ = fromMatSort(this.sort);
    this.pageEvents$ = fromMatPaginator(this.paginator);
    this.getAllTransactions();
  }
  getAllTransactions(): void {
    this.loading();
    const username = this.loginService.getUsernameAndId().username;
    this.store.dispatch(new transactionActions.GetAllArchiveTransactions(username));
    this.dataToSubscribe = this.store.select(fromRoot.fetchedTransaction).pipe(takeUntil(this.ngbSubscribe))
      .subscribe((data) => {
        if (data.loaded) {
          this.allTransactions = data.data.archivesTransactions;
          this.updateTable();
          this.loaded();
          this.dataToSubscribe.unsubscribe();
        }
      }, (error) => {
        this.loaded();
        this.messageService.failedMessage(error, 'Dismiss');
      });
  }
  updateTable(): void {
    const rows$ = of(this.allTransactions);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(this.sortRows(this.sortEvents$), paginateRows(this.pageEvents$));
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
  loading() {
    this.isLoading = true;
    this.spinnerService.show();
  }
  loaded() {
    this.isLoading = false;
    this.spinnerService.hide();
  }

}


