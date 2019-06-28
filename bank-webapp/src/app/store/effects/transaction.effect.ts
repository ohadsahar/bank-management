import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import {catchError, switchMap, map, exhaustMap} from 'rxjs/operators';
import { of } from 'rxjs';
import * as transactionActions from '../actions/transaction.actions';
import { BankTranscationService } from '../../core/services/bank-transcation.service';

@Injectable({providedIn: 'root'})

export class TransactionEffect {
  constructor(private actions$: Actions, private bankService: BankTranscationService) {}
  @Effect()
  public registerTransaction$ = this.actions$.pipe(ofType(transactionActions.REGISTER_TRANSACTION))
  .pipe(switchMap((action: transactionActions.RegisterTransaction) => {
    return this.bankService.registerNewTranscation(action.payload).pipe(
      map(transaction => new transactionActions.RegisterTransactionSuccess(transaction.message)),
      catchError(error => of(new transactionActions.RegisterTransactionFailed(error)
        )));
     }));
}

