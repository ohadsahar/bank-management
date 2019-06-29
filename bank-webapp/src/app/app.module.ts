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
import { TransactionEffect } from './store/effects/transaction.effect';
import { RegisterNewTransactionModalComponent } from './shared/modals/register-new-transaction.component';
import { PaymentManagementComponent } from './core/components/payment-management/payment-management.component';
import { MenuComponent } from './core/components/menu/menu.component';
import { SalaryComponent } from './core/components/salary-managment/salary.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BankManagmentComponent,
    RegisterNewTransactionModalComponent,
    PaymentManagementComponent,
    MenuComponent,
    SalaryComponent
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
    EffectsModule.forRoot([BankManagementEffects, TransactionEffect]),
    DeviceDetectorModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [],

  bootstrap: [AppComponent],
  entryComponents: [RegisterNewTransactionModalComponent]
})
export class AppModule { }
