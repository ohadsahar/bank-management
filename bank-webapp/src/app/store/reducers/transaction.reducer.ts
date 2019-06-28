import {
  TransactionActions,
  REGISTER_TRANSACTION, REGISTER_TRANSACTION_SUCCESS, REGISTER_TRANSACTION_FAILED,
  GET_ALL_TRANSACTION, GET_ALL_TRANSACTIONS_SUCCESS, GET_ALL_TRANSACTIONS_FAILED
} from '../actions/transaction.actions';

export interface State {
  loading: boolean;
  loaded: boolean;
  data: any[];
}

const initialState: State = {
  loading: true,
  loaded: false,
  data: [],
};

export function transactionReducer(state = initialState, action: TransactionActions) {
  switch (action.type) {
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
        data: action.payload
      };
    case GET_ALL_TRANSACTIONS_FAILED:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };

    default:
      return initialState;
  }
}
export const newTransactionData = (state: State) => state;
