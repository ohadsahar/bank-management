import {
  TransactionActions, GET_ALL_TRANSACTION, GET_ALL_TRANSACTIONS_FAILED,
  GET_ALL_TRANSACTIONS_SUCCESS, GET_ALL_ARCHIVE_TRANSACTIONS,
  GET_ALL_ARCHIVE_TRANSACTIONS_SUCCESS, GET_ALL_ARCHIVE_TRANSACTIONS_FAILED
} from './../actions/transaction.actions';
import { Bank } from 'src/app/shared/models/bank-data.model';

export interface State {
  loading: boolean;
  loaded: boolean;
  data: Bank | any;
}

const initialState: State = {
  loading: true,
  loaded: false,
  data: []
};


export function transactionFetchReducer(state = initialState, action: TransactionActions) {
  switch (action.type) {
    case GET_ALL_TRANSACTION:
      return {
        ...state,
        loading: true,
        loaded: false
      };
    case GET_ALL_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload,
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
    default:
      return state;
  }
}

export const fetchedTransaction = (state: State) => state;
