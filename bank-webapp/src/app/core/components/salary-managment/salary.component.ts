import { MessageService } from './../../services/message.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, Sort, PageEvent } from '@angular/material';
import { Store } from '@ngrx/store';
import { Chart } from 'chart.js';
import { Subject, Subscription, combineLatest, of, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { SalaryData } from 'src/app/shared/models/edit-salary.model';
import { SalaryModel } from 'src/app/shared/models/salary.model';
import * as fromRoot from '../../../app.reducer';
import { SalaryService } from '../../services/salary.service';
import * as salaryActions from './../../../store/actions/salary.actions';
import { LoginService } from './../../services/login.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { bottomItemTrigger, topItemTrigger } from 'src/app/shared/animations/salary/salary.animation';
import { ShareDataService } from '../../services/share-data.service';
import * as moment from 'moment';
import { fromMatSort, fromMatPaginator, paginateRows } from 'src/app/table-util';

type SortFn<U> = (a: U, b: U) => number;
interface PropertySortFns<U> {
  [prop: string]: SortFn<U>;
}

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [bottomItemTrigger, topItemTrigger]
})
export class SalaryComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public ngbSubscribe: Subject<void> = new Subject<void>();
  public dataToSubscribe: Subscription;
  public updateAble: boolean;
  public counter: number;
  public id: string;
  public salaryEditData: SalaryData;
  public editEnable: boolean;
  public isLoading: boolean;
  public cancelDataSa: SalaryData;
  editoptionsable: any = {};
  displayedRows$: Observable<any[]>;
  totalRows$: Observable<number>;
  public sortEvents$: Observable<Sort>;
  public pageEvents$: Observable<PageEvent>;
  public chartInComeData: Chart;
  public sortedData: SalaryModel[];
  public allSalary: SalaryModel[];
  public allInComeData: any[];
  public monthArray: string[] = [];
  public salaryArray: number[] = [];
  constructor(private salaryService: SalaryService, private loginService: LoginService,
    private messageService: MessageService, private store: Store<fromRoot.State>,
    private spinnerService: Ng4LoadingSpinnerService, private shareDataService: ShareDataService) {
    this.editEnable = false;
    this.counter = 0;
    this.updateAble = false;
  }

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'salary', 'monthOfSalary', 'yearOfSalary'];

  ngOnInit() {
    this.onLoadComponent();
  }
  onLoadComponent() {
    this.loading();
    this.sortEvents$ = fromMatSort(this.sort);
    this.pageEvents$ = fromMatPaginator(this.paginator);
    const username = this.loginService.getUsernameAndId().username;
    this.salaryService.get(username).subscribe(response => {
      this.allSalary = response.message.salary as any;
      this.updateTable();
      this.loaded();
    }, (error) => {
      this.loaded();
      this.messageService.failedMessage(error, 'Dismiss');
    });
  }
  registerSalary(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.loading();
    const salaryData = {
      salary: form.value.salary,
      username: this.loginService.getUsernameAndId().username,
      yearOfSalary: Number(moment(Date.now()).format('YYYY'))
    };
    this.store.dispatch(new salaryActions.RegisterNewSalary(salaryData));
    this.dataToSubscribe = this.store.select(fromRoot.getSalaryData).pipe(takeUntil(this.ngbSubscribe))
      .subscribe((data) => {
        if (data.loaded) {
          this.allSalary.push(data.data);
          this.getSalaryByMonths();
          this.updateTable();
          this.messageService.successMessage('המשכורת התווספה בהצלחה', 'סגור');
          this.dataToSubscribe.unsubscribe();
          this.loaded();
        }
      }, (error) => {
        this.loaded();
        this.messageService.failedMessage(error, 'Dismiss');
      });
  }
  getSalaryByMonths() {
    this.loading();
    const username = this.loginService.getUsernameAndId().username;
    this.salaryService.get(username).subscribe(response => {
      this.shareDataService.changeSalary(response.message.salaryByMonth);
      this.loaded();
    }, (error) => {
      this.loaded();
      this.messageService.failedMessage(error, 'Dismiss');
    });
  }
  deleteSalary(salaryId: string): void {
    this.loading();
    this.store.dispatch(new salaryActions.DeleteSalary(salaryId));
    this.dataToSubscribe = this.store.select(fromRoot.getSalaryData).pipe(takeUntil(this.ngbSubscribe))
      .subscribe((data) => {
        if (data.loaded) {
          const deleteSalary = this.allSalary.filter(salary => salary._id !== salaryId);
          this.allSalary = deleteSalary;
          this.getSalaryByMonths();
          this.updateTable();
          this.messageService.successMessage('המשכורת נמחקה בהצלחה', 'סגור');
          this.dataToSubscribe.unsubscribe();
          this.loaded();
        }
      }, (error) => {
        this.loaded();
        this.messageService.failedMessage(error, 'Dismiss');
      });
  }
  editSalary(salaryData: SalaryData): void {
    this.cancelDataSa = Object.assign({}, salaryData);
    this.id = salaryData._id;
    this.updateAble = true;
    this.counter = this.counter + 1;
    this.salaryEditData = salaryData;
    this.salaryEditData.username = this.loginService.getUsernameAndId().username;
    if (this.counter === 1) {
      this.editEnable = true;
    } else {
      this.counter = 0;
    }
  }
  updateSalary(): void {
    this.loading();
    this.store.dispatch(new salaryActions.UpdateSalary(this.salaryEditData));
    this.dataToSubscribe = this.store.select(fromRoot.getSalaryData).pipe(takeUntil(this.ngbSubscribe))
      .subscribe((data) => {
        if (data.loaded) {
          const index = this.allSalary.findIndex(salary => salary._id === this.id);
          this.allSalary[index] = data.data;
          this.getSalaryByMonths();
          this.updateTable();
          this.updateAble = false;
          this.messageService.successMessage('המשכורת עודכנה בהצלחה', 'סגור');
          this.dataToSubscribe.unsubscribe();
          this.loaded();
        }
      }, (error) => {
        this.loaded();
        this.messageService.failedMessage(error, 'Dismiss');
      });
  }
  cancelUpdate(): void {
    this.salaryEditData.salary = this.cancelDataSa.salary;
    this.salaryEditData.monthOfSalary = this.cancelDataSa.monthOfSalary;
    this.updateAble = false;
    this.messageService.successMessage('ביטול המשכורת בוצע בהצלחה', 'סגור');
  }
  updateTable(): void {
    const rows$ = of(this.allSalary);
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
