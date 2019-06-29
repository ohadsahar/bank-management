import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentManagementComponent } from './core/components/payment-management/payment-management.component';
import { BankManagmentComponent } from './core/components/bank-managment/bank-managment.component';

const routes: Routes = [
  { path: 'payment', component: PaymentManagementComponent },
  { path: 'management', component: BankManagmentComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
