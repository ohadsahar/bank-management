import { MessageService } from './../../services/message.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { Store } from '@ngrx/store';
import { Chart } from 'chart.js';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SalaryData } from 'src/app/shared/models/edit-salary.model';
import { SalaryModel } from 'src/app/shared/models/salary.model';
import * as fromRoot from '../../../app.reducer';
import { SalaryService } from '../../services/salary.service';
import * as salaryActions from './../../../store/actions/salary.actions';
import { LoginService } from './../../services/login.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { bottomItemTrigger, topItemTrigger } from 'src/app/shared/animations/salary/salary.animation';
import { ShareDataService } from '../../services/share-data.service';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [bottomItemTrigger, topItemTrigger]
})
export class SalaryComponent implements OnInit {
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'salary', 'monthOfSalary'];

  ngOnInit() {
    this.onLoadComponent();
  }
  onLoadComponent() {
    const username = this.loginService.getUsernameAndId().username;
    this.salaryService.get(username).subscribe(response => {
      this.allSalary = response.message.salary as any;
      this.updateTable();
    });
  }
  registerSalary(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    const salaryData = {
      salary: form.value.salary,
      username: this.loginService.getUsernameAndId().username
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
        }
      });
  }
  getSalaryByMonths() {
    const username = this.loginService.getUsernameAndId().username;
    this.salaryService.get(username).subscribe(response => {
      this.shareDataService.changeSalary(response.message.salaryByMonth);
    });
  }
  deleteSalary(salaryId: string): void {
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
        }
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
        }
      });
  }
  cancelUpdate(): void {
    this.salaryEditData.salary = this.cancelDataSa.salary;
    this.salaryEditData.monthOfSalary = this.cancelDataSa.monthOfSalary;
    this.updateAble = false;
    this.messageService.successMessage('ביטול המשכורת בוצע בהצלחה', 'סגור');
  }
  updateTable(): void {
    this.dataSource = new MatTableDataSource(this.allSalary);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  sortData(sort: Sort) {
    this.sortedData = this.allSalary;
    const data = this.allSalary.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'salary': return this.compare(a.salary, b.salary, isAsc);
        default: return 0;
      }
    });
    this.allSalary = this.sortedData;
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
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
