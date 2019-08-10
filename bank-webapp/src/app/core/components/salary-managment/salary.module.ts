import { MatExpansionModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from './../../../angular-material.module';
import { NgModule } from '@angular/core';
import { SalaryComponent } from './salary.component';
import { CommonModule } from '@angular/common';
import { SalaryRoutingModule } from './salary-routing.module';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
  declarations: [
    SalaryComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    SalaryRoutingModule,
    Ng4LoadingSpinnerModule,
    MatExpansionModule
  ]
})
export class SalaryModule {

}
