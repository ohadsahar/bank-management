import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BankTranscationService } from '../../core/services/bank-transcation.service';
import * as chartActions from '../actions/chart.actions';

@Injectable()
export class BankManagementEffects {

  constructor(private actions$: Actions, private bankService: BankTranscationService) {}

  @Effect()
  public getCharts$ = this.actions$.pipe(ofType(chartActions.GET_CHARTS))
    .pipe(switchMap((action: chartActions.GetCharts) => {
      return this.bankService.getCharts(action.payload).pipe(map(charts => new chartActions.ChartSuccess(charts.message)),
        catchError(error => of(new chartActions.ChartFailed(error)
        )));
    }));
}
