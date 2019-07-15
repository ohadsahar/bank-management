import { Bank } from '../../shared/models/bank-data.model';

import {
  TransactionActions,
  REGISTER_TRANSACTION, REGISTER_TRANSACTION_SUCCESS, REGISTER_TRANSACTION_FAILED,
  GET_ALL_TRANSACTION, GET_ALL_TRANSACTIONS_SUCCESS, GET_ALL_TRANSACTIONS_FAILED,
  UPDATE_TRANSACTION, UPDATE_TRANSACTION_SUCCESS, UPDATE_TRANSACTION_FAILED,
  DELETE_TRANSACTION, DELETE_TRANSACTION_SUCCESS, DELETE_TRANSACTION_FAILED,
  GET_ALL_ARCHIVE_TRANSACTIONS, GET_ALL_ARCHIVE_TRANSACTIONS_SUCCESS, GET_ALL_ARCHIVE_TRANSACTIONS_FAILED
} from '../actions/transaction.actions';

export interface State {
  loading: boolean;
  loaded: boolean;
  data: Bank | any;
}

const initialState: State = {
  loading: false,
  loaded: false,
  data: null,
};

export function transactionReducer(state = initialState, action: TransactionActions) {
  switch (action.type) {
    case GET_ALL_TRANSACTION:
      return {
        ...state,
        loading: true,
        loaded: false,
        data: action.payload
      };
    case GET_ALL_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case GET_ALL_TRANSACTIONS_FAILED:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case GET_ALL_ARCHIVE_TRANSACTIONS:
      return {
        ...state,
        loading: true,
        loaded: false
      };
    case GET_ALL_ARCHIVE_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case GET_ALL_ARCHIVE_TRANSACTIONS_FAILED:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case REGISTER_TRANSACTION:
      return {
        ...state,
        loading: true,
        loaded: false,
        data: action.payload
      };
    case REGISTER_TRANSACTION_SUCCESS:

      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case REGISTER_TRANSACTION_FAILED:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case UPDATE_TRANSACTION:
      return {
        ...state,
        loading: true,
        loaded: false,
        data: action.payload
      };
    case UPDATE_TRANSACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case UPDATE_TRANSACTION_FAILED:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case DELETE_TRANSACTION:
      return {
        ...state,
        loading: true,
        loaded: false,
        data: action.payload
      };
    case DELETE_TRANSACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case DELETE_TRANSACTION_FAILED:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    default:
      return state;
  }
}
export const newTransactionData = (state: State) => state;

