import { AuthGuard } from './shared/modals/login/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainMenuComponent } from './core/components/main-menu/main-menu.component';
import { MenuComponent } from './core/components/menu/menu.component';

const routes: Routes = [
  { path: '', component: MainMenuComponent },
  {
    path: 'user-payment',
    loadChildren: './core/components/payment-management/payment-management-modules/payment-management.module#PaymentManagementModule'
  },
  {
    path: 'user-management',
    loadChildren: './core/components/bank-managment/bank-management-modules/bank-management.module#BankManagementModule'
  },
  {
    path: 'user-salary',
    loadChildren: './core/components/salary-managment/salary.module#SalaryModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
