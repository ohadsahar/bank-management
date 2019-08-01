import { SalaryManagementChartComponent } from '../salary-management-chart/salary-management-chart.component';
import { BankManagementChartRouting } from './bank-management-chart-routing.module';
import { BankManagementChartComponent } from './../bank-management-chart.component';
import { AngularMaterialModule } from './../../../../angular-material.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';


@NgModule({
  declarations: [BankManagementChartComponent, SalaryManagementChartComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    BankManagementChartRouting,
    Ng4LoadingSpinnerModule.forRoot()
  ]
})

export class BankManagementChartModule { }

