import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { HomePageRouting } from './home-routing.module';
import { HomePageComponent } from './../home.component';
import { AngularMaterialModule } from './../../../../angular-material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    HomePageRouting,
    Ng4LoadingSpinnerModule
  ]
})
export class HomeModule { }
