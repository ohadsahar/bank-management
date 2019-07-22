import { DELETE_TRANSACTION } from './transaction.actions';
import { Action } from '@ngrx/store';
import { SalaryModel } from 'src/app/shared/models/salary.model';
export const REGISTER_NEW_SALARY = 'REGISTER_NEW_SALARY';
export const REGISTER_NEW_SALARY_SUCCESS = 'REGISTER_NEW_SALARY_SUCCESS';
export const REGISTER_NEW_SALARY_FAILED = 'REGISTER_NEW_SALARY_FAILED';
export const UPDATE_SALARY = 'UPDATE_SALARY';
export const UPDATE_SALARY_SUCCESS = 'UPDATE_SALARY_SUCCESS';
export const UPDATE_SALARY_FAILED = 'UPDATE_SALARY_FAILED';
export const DELETE_SALARY = 'DELETE_SALARY';
export const DELETE_SALARY_SUCCESS = 'DELETE_SALARY_SUCCESS';
export const DELETE_SALARY_FAILED = 'DELETE_SALARY_FAILED';

export class RegisterNewSalary implements Action {
  readonly type = REGISTER_NEW_SALARY;
  constructor(public payload: any) {}
}
export class RegisterNewSalarySuccess implements Action {
  readonly type = REGISTER_NEW_SALARY_SUCCESS;
  constructor(public payload: SalaryModel) {}
}
export class RegisterNewSalaryFailed implements Action {
  readonly type = REGISTER_NEW_SALARY_FAILED;
  constructor(public payload: any) {}
}
export class UpdateSalary implements Action {
  readonly type = UPDATE_SALARY;
  constructor(public payload: any) {}
}
export class UpdateSalarySuccess implements Action {
  readonly type = UPDATE_SALARY_SUCCESS;
  constructor(public payload: any){}
}
export class UpdateSalaryFailed implements Action {
  readonly type = UPDATE_SALARY_FAILED;
  constructor(public payload: any) {}
}
export class DeleteSalary implements Action {
  readonly type = DELETE_SALARY;
  constructor(public payload: any) {}
}
export class DeleteSalarySuccess implements Action {
  readonly type = DELETE_SALARY_SUCCESS;
  constructor(public payload: any) {}
}
export class DeleteSalaryFailed implements Action {
  readonly type = DELETE_SALARY_FAILED;
  constructor(public payload: any) {}
}

export type SalaryActions = RegisterNewSalary | RegisterNewSalarySuccess | RegisterNewSalaryFailed |
UpdateSalary | UpdateSalarySuccess | UpdateSalaryFailed | DeleteSalary | DeleteSalarySuccess | DeleteSalaryFailed;

