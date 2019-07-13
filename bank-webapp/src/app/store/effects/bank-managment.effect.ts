import { TransactionActions } from './../actions/transaction.actions';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
import { BankTranscationService } from '../../core/services/bank-transcation.service';
import * as chartActions from '../actions/chart.actions';
import { of } from 'rxjs';

@Injectable()
export class BankManagementEffects {

  constructor(private actions$: Actions, private bankService: BankTranscationService) {
  }

  @Effect()
  public getCharts$ = this.actions$.pipe(ofType(chartActions.GET_CHARTS))
    .pipe(exhaustMap(() => {
      return this.bankService.getCharts().pipe(map(charts => new chartActions.ChartSuccess(charts.message)),
        catchError(error => of(new chartActions.ChartFailed(error)
        )));
    }));



}
