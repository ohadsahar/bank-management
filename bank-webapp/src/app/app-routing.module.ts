import { AuthGuard } from './shared/modals/login/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentManagementComponent } from './core/components/payment-management/payment-management.component';
import { BankManagmentComponent } from './core/components/bank-managment/bank-managment.component';
import { SalaryComponent } from './core/components/salary-managment/salary.component';
import { MainMenuComponent } from './core/components/main-menu/main-menu.component';
import { MenuComponent } from './core/components/menu/menu.component';

const routes: Routes = [
  { path: '', component: MainMenuComponent },
  { path: 'payment', component: PaymentManagementComponent, canActivate: [AuthGuard] },
  { path: 'management', component: BankManagmentComponent, canActivate: [AuthGuard] },
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
  { path: 'salary', component: SalaryComponent, canActivate: [AuthGuard] }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
