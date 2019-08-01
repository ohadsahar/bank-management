import { HomePageComponent } from './../home.component';
import { AuthGuard } from './../../../../shared/modals/login/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] }
];

@NgModule({

  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HomePageRouting {

}
