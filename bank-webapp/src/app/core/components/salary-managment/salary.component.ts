import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SalaryService } from '../../services/salary.service';
import { MatTableDataSource, MatSort, MatPaginator, Sort } from '@angular/material';
import { SalaryModel } from 'src/app/shared/models/salary.model';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.css']
})

export class SalaryComponent implements OnInit {

  public chartInComeData: Chart;
  public sortedData: SalaryModel[];
  public allSalary: SalaryModel[];
  public allInComeData:any[];
  public monthArray: string [] = [];
  public salaryArray: number[] = [];
  constructor(private salaryService: SalaryService) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'salary', 'monthOfSalary'];

  ngOnInit() {
    this.onLoadComponent();
  }
  onLoadComponent() {
    this.salaryService.get().subscribe(response => {
      this.allInComeData = response.message.salaryByMonth;
      this.allSalary = response.message.salary as any;
      this.updateTable();
      this.assignChartDataInCome();
    });

  }
  onSubmitSalary(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.salaryService.createNewSalary(form.value).subscribe(response => {
      this.allSalary.push(response.message);
      this.updateTable();
    })
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
  assignChartDataInCome() {

    this.allInComeData.forEach(element => {
      this.monthArray.push(element.monthOfSalary);
      this.salaryArray.push(element.salary);
    });
    this.expensesByCurrentMonthChart('bar');
  }
  expensesByCurrentMonthChart(type: string): void {
    this.chartInComeData = new Chart('chartInComeData', {
      type,
      data: {
        datasets: [{
          label: 'משכורות לפי חודשים',
          data: this.salaryArray,
          backgroundColor: ['#fbd0c6', '#f6c1a6', '#c8c87a', '#79c0b0', '#7ec2a3', '#65b6bd',
            '#70a6ca', '#90b4cb']
        },],

        labels: this.monthArray,
      },
      options: {
        scales: {
          xAxes: [{
            stacked: true,
            barThickness: 8,
            maxBarThickness: 10
          }],
          yAxes: [{
            stacked: true,
            barThickness: 8,
            maxBarThickness: 10
          }]
        },
        animation: false,
      }
    });
  }

}
