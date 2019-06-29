import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Bank } from '../../../shared/models/bank-data.model';
import { BankValues } from '../../../shared/models/bank.model';
import { ChartByCardName } from '../../../shared/models/chart-by-cardname.model';
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
  public oldTransactions: Bank[];
  public chartTransactions: ChartByCardName[];
  public chartByMonthTransactions: any[];
  public arrayCardsNames: string[] = [];
  public arrayCardsTotalPrice: number[] = [];
  public arrayExpansesEachMonth: number[] = [];
  public arrayEachMonthData: string[] = [];
  options: string[] = ['הספרייה', 'רנואר', 'קאסטרו', 'אייבורי'];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();
  public totalExpenses: number;
  public monthExpenses: number;
  public numberOfPayments: number;
  public editEnable: boolean;
  public updateAble: boolean;
  public allCardChart: Chart;
  public allExpensesByMonthChart: Chart;
  public eachMonthExpenses: Chart;
  public loading: boolean;
  public loaded: boolean;
  public archiveTransactions: Bank[];
  private getCharts$: Subject<void> = new Subject<void>();
  public registerNewTransactionNgrx: Subject<void> = new Subject<void>();
  public updateTransaction$: Subject<void> = new Subject<void>();
  public editoptionsable: any = {};
  public bankEditTransaction = new BankValues('', '', '', '', null, null, null, null, '', '');
  constructor(
    private paymentService: PaymentTransactionArchiveService,
    public router: Router,
    public dialog: MatDialog
  ) {
    this.totalExpenses = 0;
    this.monthExpenses = 0;
    this.numberOfPayments = 0;
    this.editEnable = false;
    this.updateAble = false;
  }
  dataSource = new MatTableDataSource();
  dataSourceOldTransactions = new MatTableDataSource();
  displayedColumns: string[] = [
    'id', 'cardName', 'name', 'type', 'price', 'numberofpayments', 'eachMonth', 'leftPayments', 'purchaseDate'
  ];
  cards: any[] = [{ value: 'הוט' }, { value: 'שופרסל' }, { value: 'נגב' }, { value: 'יוניק' },
  { value: 'דרים קארד' }, { value: 'מאסטר-קארד אוהד' }, { value: 'דרים קארד אוהד' }];
  categories: any[] = [{ value: 'חשמל' }, { value: 'ביגוד' }, { value: 'ריהוט' },
  { value: 'אוכל' }, { value: 'תכשיטים' }, { value: 'בריאות' }, { value: 'אחר' }];


  ngOnInit() {
    this.onLoadSite();
  }
  onLoadSite(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
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
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  ngOnDestroy() {
    this.getCharts$.complete();
    this.registerNewTransactionNgrx.complete();
    this.registerNewTransactionNgrx.unsubscribe();
    this.getCharts$.unsubscribe();
  }
}


