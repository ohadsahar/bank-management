import { TransactionActions,
REGISTER_TRANSACTION, REGISTER_TRANSACTION_SUCCESS, REGISTER_TRANSACTION_FAILED } from '../actions/transaction.actions';

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
        loading: true,
        loaded: true,
        data: action.payload
      };
    case REGISTER_TRANSACTION_FAILED:
      return {
        ...state,
        loading: true,
        loaded: true,
        data: action.payload
      };
  }
}
export const newTransactionData = (state: State) => state;
