import { AuthGuard } from './../../../../shared/modals/login/auth.guard';
import { BankManagmentComponent } from './../bank-managment.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: 'management', component: BankManagmentComponent , canActivate: [AuthGuard]}
]

@NgModule({

  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BankManagementRouting {

}
