import { FormsModule } from '@angular/forms';
import { BankManagementRouting } from './bank-management-routing.module';
import { AngularMaterialModule } from './../../../../angular-material.module';
import { BankManagmentComponent } from './../bank-managment.component';
import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { BankManagementChartComponent } from '../bank-management-chart/bank-management-chart.component';

@NgModule({
  declarations: [BankManagmentComponent, BankManagementChartComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    BankManagementRouting,
    AngularMaterialModule,
    FormsModule,
    Ng4LoadingSpinnerModule.forRoot()
  ]
})

export class BankManagementModule { }

