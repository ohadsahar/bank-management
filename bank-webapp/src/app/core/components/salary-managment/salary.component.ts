import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SalaryService } from '../../services/salary.service';
import { MatTableDataSource, MatSort, MatPaginator, Sort } from '@angular/material';
import { SalaryModel } from 'src/app/shared/models/salary.model';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.css']
})

export class SalaryComponent implements OnInit {

  public sortedData: SalaryModel[];
  public allSalary: SalaryModel[];
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
      this.allSalary = response.message as any;
      this.updateTable();
    })
  }
  onSubmitSalary(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.salaryService.createNewSalary(form.value).subscribe(response => {
      console.log(response);
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
}
