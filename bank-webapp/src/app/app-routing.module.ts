import { MenuComponent } from './core/components/menu/menu.component';
import { AuthGuard } from './shared/modals/login/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // { path: '', component: MenuComponent },
  {
    path: 'user-home',
    loadChildren: './core/components/home/home-module/home.module#HomeModule'
  },
  {
    path: 'user-chart',
    loadChildren: './core/components/bank-management-chart/bank-management-chart-modules/bank-management-chart.module#BankManagementChartModule'
  },
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
  {
    path: 'user-card-management',
    loadChildren: './core/components/cards-management/cards-management-modules/cards-management.module#CardManagementModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
