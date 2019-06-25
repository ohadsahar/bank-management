import { Action } from '@ngrx/store';
export const REGISTER_TRANSACTION = 'REGISTER_TRANSACTION';
export const REGISTER_TRANSACTION_SUCCESS = 'REGISTER_TRANSACTION_SUCCESS';
export const REGISTER_TRANSACTION_FAILED = 'REGISTER_TRANSACTION_FAILED';

export class RegisterTransaction implements Action {
  readonly type = REGISTER_TRANSACTION;
  constructor(public payload: any) {}
}

export class RegisterTransactionSuccess implements Action {
  readonly type = REGISTER_TRANSACTION_SUCCESS;
  constructor(public payload: any) {}
}

export class RegisterTransactionFailed implements Action {
  readonly type = REGISTER_TRANSACTION_FAILED;
  constructor(public payload: any) {}
}

export type TransactionActions = RegisterTransaction | RegisterTransactionSuccess | RegisterTransactionFailed;
