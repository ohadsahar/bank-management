import * as transactionActions from '../actions/transaction.actions';
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


export function transactionFetchReducer(state = initialState, action: transactionActions.Actions) {
  switch (action.type) {
    case transactionActions.GET_ALL_TRANSACTION:
      return {
        ...state,
        loading: true,
        loaded: false
      };
    case transactionActions.GET_ALL_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload,
      };
    case transactionActions.GET_ALL_TRANSACTIONS_FAILED:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };

    case transactionActions.GET_ALL_ARCHIVE_TRANSACTIONS:
      return {
        ...state,
        loading: true,
        loaded: false
      };
    case transactionActions.GET_ALL_ARCHIVE_TRANSACTIONS_SUCCESS:
      console.log('1');
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case transactionActions.GET_ALL_ARCHIVE_TRANSACTIONS_FAILED:
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
