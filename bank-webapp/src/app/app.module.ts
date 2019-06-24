import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './core/components/login/login.component';
import { AngularMaterialModule } from './angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { Reducers } from './app.reducer';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { BankManagmentComponent } from './core/components/bank-managment/bank-managment.component';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { BankManagementEffects } from './store/effects/bank-managment.effect';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BankManagmentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    HttpClientModule,
    EffectsModule,
    StoreModule.forRoot(Reducers),
    EffectsModule.forRoot([BankManagementEffects]),
    DeviceDetectorModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [],

  bootstrap: [AppComponent]
})
export class AppModule { }
