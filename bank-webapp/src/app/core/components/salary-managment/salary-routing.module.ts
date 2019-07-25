import { AuthGuard } from './../../../shared/modals/login/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SalaryComponent } from './salary.component';

const routes: Routes = [
  { path: 'salary', component: SalaryComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class SalaryRoutingModule {

}
