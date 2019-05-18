import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './core/components/login/login.component';
import { AngularMaterialModule } from './angular-material.module';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { Reducers } from './app.reducer';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { MoviesManagmentComponent } from './core/components/movies-managment/movies-managment.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MoviesManagmentComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularMaterialModule,
    StoreModule.forRoot(Reducers),
    DeviceDetectorModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [],

  bootstrap: [AppComponent]
})
export class AppModule { }
