
import * as transactionActions from '../actions/transaction.actions';

export interface State {
  data: any;
  loading: boolean;
  loaded: boolean;
}

const initialState: State = {
  data: [],
  loading: true,
  loaded: false,
};

export function transactionReducer(state = initialState, action: transactionActions.Actions) {
  switch (action.type) {
    case transactionActions.REGISTER_TRANSACTION:
      return {
        ...state,
        loading: true,
        loaded: false,
        data: action.payload
      };
    case transactionActions.REGISTER_TRANSACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case transactionActions.REGISTER_TRANSACTION_FAILED:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case transactionActions.UPDATE_TRANSACTION:
      return {
        ...state,
        loading: true,
        loaded: false,
        data: action.payload
      };
    case transactionActions.UPDATE_TRANSACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case transactionActions.UPDATE_TRANSACTION_FAILED:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case transactionActions.DELETE_TRANSACTION:
      return {
        ...state,
        loading: true,
        loaded: false,
        data: action.payload
      };
    case transactionActions.DELETE_TRANSACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case transactionActions.DELETE_TRANSACTION_FAILED:
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

