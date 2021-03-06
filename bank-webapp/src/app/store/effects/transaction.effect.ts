import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, exhaustMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as transactionActions from '../actions/transaction.actions';
import { BankTranscationService } from '../../core/services/bank-transcation.service';
import { PaymentTransactionArchiveService } from 'src/app/core/services/payment-transaction.service';

@Injectable({ providedIn: 'root' })

export class TransactionEffect {
  constructor(private actions$: Actions, private bankService: BankTranscationService,
              private paymentService: PaymentTransactionArchiveService) { }

  @Effect()
  public registerTransaction$ = this.actions$.pipe(ofType(transactionActions.REGISTER_TRANSACTION))
    .pipe(switchMap((action: transactionActions.RegisterTransaction) =>
      this.bankService.registerNewTransaction(action.payload).pipe(
        map((data) => {
          if (data.message) {
            return new transactionActions.RegisterTransactionSuccess(data.message);
          }
        }),
        catchError((error) => {
          return of(new transactionActions.RegisterTransactionFailed(error));
        }),
      ),
    ),
    );

  @Effect()
  public allTransactions$ = this.actions$.pipe(ofType(transactionActions.GET_ALL_TRANSACTION))
    .pipe(switchMap((action: transactionActions.GetAllTransactions) => {
      return this.bankService.getTransactions(action.payload).pipe(map(transaction =>
        new transactionActions.GetAllTransactionSuccess(transaction.message)),
        catchError(error => of(new transactionActions.GetAllTransactionsFailed(error)
        )));
    }));

  @Effect()
  public allArchiveTransactions$ = this.actions$.pipe(ofType(transactionActions.GET_ALL_ARCHIVE_TRANSACTIONS))
    .pipe(switchMap(() => {
      return this.paymentService.getAllArchiveTransactions().pipe(map(transactionArchive =>
        new transactionActions.GetAllArchiveTransactionsSuccess(transactionArchive.message)),
        catchError(error => of(new transactionActions.GetAllArchiveTransactionsFailed(error)
        )));
    }));

  @Effect()
  public deleteTransaction$ = this.actions$.pipe(ofType(transactionActions.DELETE_TRANSACTION))
    .pipe(switchMap((action: transactionActions.DeleteTransaction) => {
      return this.bankService.deleteTransaction(action.payload).pipe(
        map(transaction => new transactionActions.DeleteTransactionSuccess(transaction.message)),
        catchError(error => of(new transactionActions.GetAllTransactionsFailed(error))));
    }));

  @Effect()
  public updateTransaction$ = this.actions$.pipe(ofType(transactionActions.UPDATE_TRANSACTION))
    .pipe(switchMap((action: transactionActions.UpdateTransaction) => {
      return this.bankService.updateTransaction(action.payload).pipe(
        map(transaction => new transactionActions.UpdateTransactionSuccess(transaction.message)),
        catchError(error => of(new transactionActions.UpdateTransactionFailed(error))));
    }));

}




