import { NgModule } from '@angular/core';
import {MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatSnackBarModule } from '@angular/material';


@NgModule({
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  exports: [
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})

export class AngularMaterialModule {

}
