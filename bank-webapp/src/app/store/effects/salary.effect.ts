import { exhaustMap, map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects'
import * as salaryActions from '../actions/salary.actions';
import { SalaryService } from 'src/app/core/services/salary.service';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class SalaryEffects {
  constructor(private actions$: Actions, private salaryService: SalaryService) { }

  @Effect()
  public registerSalary$ = this.actions$.pipe(ofType(salaryActions.REGISTER_NEW_SALARY))
    .pipe(exhaustMap((action: salaryActions.RegisterNewSalary) => {
      return this.salaryService.registerSalary(action.payload).pipe(map(salary =>
        new salaryActions.RegisterNewSalarySuccess(salary.message)),
        catchError(error => of(new salaryActions.RegisterNewSalaryFailed(error)
        )));
    }));

  @Effect()
  public deleteSalary$ = this.actions$.pipe(ofType(salaryActions.DELETE_SALARY))
    .pipe(exhaustMap((action: salaryActions.DeleteSalary) => {
      return this.salaryService.deleteSalary(action.payload).pipe(map(salary =>
        new salaryActions.DeleteSalarySuccess(salary.message)),
        catchError(error => of(new salaryActions.DeleteSalaryFailed(error)
        )));
    }));

  @Effect()
  public updateSalary$ = this.actions$.pipe(ofType(salaryActions.UPDATE_SALARY))
  .pipe(exhaustMap((action: salaryActions.UpdateSalary) => {
    return this.salaryService.updateSalary(action.payload).pipe(map(salary =>
      new salaryActions.UpdateSalarySuccess(salary.message)),
      catchError(error => of(new salaryActions.UpdateSalaryFailed(error)
      )));
  }));
}
