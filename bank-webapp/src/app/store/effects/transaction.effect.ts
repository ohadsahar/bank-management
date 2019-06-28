import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, exhaustMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as transactionActions from '../actions/transaction.actions';
import { BankTranscationService } from '../../core/services/bank-transcation.service';

@Injectable({ providedIn: 'root' })

export class TransactionEffect {
  constructor(private actions$: Actions, private bankService: BankTranscationService) { }
  @Effect()
  public registerTransaction$ = this.actions$.pipe(ofType(transactionActions.REGISTER_TRANSACTION))
    .pipe(exhaustMap((action: transactionActions.RegisterTransaction) => {
      return this.bankService.registerNewTransaction(action.payload).pipe(
        map(transaction => new transactionActions.RegisterTransactionSuccess(transaction.message)),
        catchError(error => of(new transactionActions.RegisterTransactionFailed(error)
        )));
    }));


  @Effect()
  public allTransactions$ = this.actions$.pipe(ofType(transactionActions.GET_ALL_TRANSACTION))
    .pipe(exhaustMap(() => {
      return this.bankService.getTransactions().pipe(map(transaction =>
        new transactionActions.GetAllTransactionSuccess(transaction.message)),
        catchError(error => of(new transactionActions.GetAllTransactionsFailed(error)
        )));
    }));
}


