import { PaymentManagementRouting } from './payment-management-routing.module';
import { AngularMaterialModule } from './../../../../angular-material.module';
import { CommonModule } from '@angular/common';
import { PaymentManagementComponent } from './../payment-management.component';
import { NgModule } from "@angular/core";



@NgModule({
  declarations: [
    PaymentManagementComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    PaymentManagementRouting
  ],
})

export class PaymentManagementModule {}
