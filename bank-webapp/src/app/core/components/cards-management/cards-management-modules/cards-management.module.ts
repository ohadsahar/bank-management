import { MatExpansionModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { CardsManagementComponent } from '../cards-management.component';
import { AngularMaterialModule } from './../../../../angular-material.module';
import { CardsManagementRouting } from './cards-management-routing.module';


@NgModule({
  declarations: [CardsManagementComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    CardsManagementRouting,
    FormsModule,
    MatExpansionModule,
    Ng4LoadingSpinnerModule.forRoot()
  ]
})

export class CardManagementModule { }

