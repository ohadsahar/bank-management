import { MatExpansionModule } from '@angular/material';
import { PaymentManagementRouting } from './payment-management-routing.module';
import { AngularMaterialModule } from './../../../../angular-material.module';
import { CommonModule } from '@angular/common';
import { PaymentManagementComponent } from './../payment-management.component';
import { NgModule } from "@angular/core";
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';



@NgModule({
  declarations: [
    PaymentManagementComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    PaymentManagementRouting,
    Ng4LoadingSpinnerModule,
    MatExpansionModule,
  ],
})

export class PaymentManagementModule {}
