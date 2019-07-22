import { Action } from '@ngrx/store';
export const GET_ALL_TRANSACTION = 'GET_ALL_TRANSACTION';
export const GET_ALL_TRANSACTIONS_SUCCESS = 'GET_ALL_TRANSACTIONS_SUCCESS';
export const GET_ALL_TRANSACTIONS_FAILED = 'GET_ALL_TRANSACTIONS_FAILED';
export const REGISTER_TRANSACTION = 'REGISTER_TRANSACTION';
export const REGISTER_TRANSACTION_SUCCESS = 'REGISTER_TRANSACTION_SUCCESS';
export const REGISTER_TRANSACTION_FAILED = 'REGISTER_TRANSACTION_FAILED';
export const DELETE_TRANSACTION = 'DELETE_TRANSACTION';
export const DELETE_TRANSACTION_SUCCESS = 'DELETE_TRANSACTION_SUCCESS';
export const DELETE_TRANSACTION_FAILED = 'DELETE_TRANSACTION_FAILED';
export const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION';
export const UPDATE_TRANSACTION_SUCCESS = 'UPDATE_TRANSACTION_SUCCESS';
export const UPDATE_TRANSACTION_FAILED = 'UPDATE_TRANSACTION_FAILED';
export const GET_ALL_ARCHIVE_TRANSACTIONS = 'GET_ALL_ARCHIVE_TRANSACTIONS';
export const GET_ALL_ARCHIVE_TRANSACTIONS_SUCCESS = 'GET_ALL_ARCHIVE_TRANSACTIONS_SUCCESS';
export const GET_ALL_ARCHIVE_TRANSACTIONS_FAILED = 'GET_ALL_ARCHIVE_TRANSACTIONS_FAILED';

export class GetAllTransactions implements Action {
  readonly type = GET_ALL_TRANSACTION;
  constructor(public payload: any) { }
}
export class GetAllTransactionSuccess implements Action {
  readonly type = GET_ALL_TRANSACTIONS_SUCCESS;
  constructor(public payload: any) {
  }
}
export class GetAllTransactionsFailed implements Action {
  readonly type = GET_ALL_TRANSACTIONS_FAILED;
  constructor(public payload: any) { }
}
export class GetAllArchiveTransactions implements Action {
  readonly type = GET_ALL_ARCHIVE_TRANSACTIONS;
  constructor(public payload: any) { }
}
export class GetAllArchiveTransactionsSuccess implements Action {
  readonly type = GET_ALL_ARCHIVE_TRANSACTIONS_SUCCESS;
  constructor(public payload: any) { }
}
export class GetAllArchiveTransactionsFailed implements Action {
  readonly type = GET_ALL_ARCHIVE_TRANSACTIONS_FAILED;
  constructor(public payload: any) { }
}
export class RegisterTransaction implements Action {
  readonly type = REGISTER_TRANSACTION;
  constructor(public payload: any) {
  }
}
export class RegisterTransactionSuccess implements Action {
  readonly type = REGISTER_TRANSACTION_SUCCESS;
  constructor(public payload: any) {
  }
}
export class RegisterTransactionFailed implements Action {
  readonly type = REGISTER_TRANSACTION_FAILED;
  constructor(public payload: any) {
  }
}
export class DeleteTransaction implements Action {
  readonly type = DELETE_TRANSACTION;
  constructor(public payload: any) { }
}
export class DeleteTransactionSuccess implements Action {
  readonly type = DELETE_TRANSACTION_SUCCESS;
  constructor(public payload: any) { }
}
export class DeleteTransactionFailed implements Action {
  readonly type = DELETE_TRANSACTION_FAILED;
  constructor(public payload: any) { }
}
export class UpdateTransaction implements Action {
  readonly type = UPDATE_TRANSACTION;
  constructor(public payload: any) { }
}
export class UpdateTransactionSuccess implements Action {
  readonly type = UPDATE_TRANSACTION_SUCCESS;
  constructor(public payload: any) { }
}
export class UpdateTransactionFailed implements Action {
  readonly type = UPDATE_TRANSACTION_FAILED;
  constructor(public payload: any) { }
}

export type TransactionActions = RegisterTransaction | RegisterTransactionSuccess |
  RegisterTransactionFailed | GetAllTransactions | GetAllTransactionSuccess |
  GetAllTransactionsFailed | DeleteTransaction | DeleteTransactionSuccess |
  DeleteTransactionFailed | UpdateTransaction | UpdateTransactionSuccess | UpdateTransactionFailed
  | GetAllArchiveTransactions | GetAllArchiveTransactionsSuccess | GetAllArchiveTransactionsFailed;
