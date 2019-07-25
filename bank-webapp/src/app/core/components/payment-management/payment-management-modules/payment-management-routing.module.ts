import { AuthGuard } from './../../../../shared/modals/login/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PaymentManagementComponent } from '../payment-management.component';

const routes: Routes = [
  {path: 'payment', component: PaymentManagementComponent, canActivate: [AuthGuard]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class PaymentManagementRouting { }
