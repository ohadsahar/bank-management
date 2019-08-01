import { BankManagementChartComponent } from '../bank-management-chart.component';
import { AuthGuard } from './../../../../shared/modals/login/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: 'chart', component: BankManagementChartComponent , canActivate: [AuthGuard]}
];

@NgModule({

  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BankManagementChartRouting {

}
