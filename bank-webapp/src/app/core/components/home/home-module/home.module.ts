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
    HomePageRouting
  ]
})
export class HomeModule { }
