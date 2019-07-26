import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from './../../../angular-material.module';
import { NgModule } from '@angular/core';
import { SalaryComponent } from './salary.component';
import { CommonModule } from '@angular/common';
import { SalaryRoutingModule } from './salary-routing.module';
import { SalaryManagementChartComponent } from './salary-management-chart/salary-management-chart.component';


@NgModule({
  declarations: [
    SalaryComponent,
    SalaryManagementChartComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    SalaryRoutingModule
  ]
})
export class SalaryModule {

}
