import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Reducers } from './app.reducer';
import { BankManagmentComponent } from './core/components/bank-managment/bank-managment.component';
import { MainMenuComponent } from './core/components/main-menu/main-menu.component';
import { MenuComponent } from './core/components/menu/menu.component';
import { PaymentManagementComponent } from './core/components/payment-management/payment-management.component';
import { SalaryComponent } from './core/components/salary-managment/salary.component';
import { DisconnectDialogComponent } from './shared/modals/disconnect/disconnect.component';
import { AuthInterceptor } from './shared/modals/login/auth-interceptor.component';
import { LoginModalComponent } from './shared/modals/login/login.component';
import { RegisterNewTransactionModalComponent } from './shared/modals/register-transaction/register-new-transaction.component';
import { RegisterUserModalComponent } from './shared/modals/register-user/register-user.component';
import { BankManagementEffects } from './store/effects/bank-managment.effect';
import { SalaryEffects } from './store/effects/salary.effect';
import { TransactionEffect } from './store/effects/transaction.effect';




@NgModule({
  declarations: [
    AppComponent,
    BankManagmentComponent,
    RegisterNewTransactionModalComponent,
    DisconnectDialogComponent,
    RegisterUserModalComponent,
    PaymentManagementComponent,
    MenuComponent,
    SalaryComponent,
    MainMenuComponent,
    LoginModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    HttpClientModule,
    StoreModule.forRoot(Reducers),
    EffectsModule.forRoot([BankManagementEffects, TransactionEffect, SalaryEffects]),
    DeviceDetectorModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],

  bootstrap: [AppComponent],
  entryComponents: [RegisterNewTransactionModalComponent, RegisterUserModalComponent, LoginModalComponent, DisconnectDialogComponent]
})
export class AppModule { }
