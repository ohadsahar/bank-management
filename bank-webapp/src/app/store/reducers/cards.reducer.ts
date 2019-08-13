import * as cardsActions from '../actions/cards.actions';
export interface State {
  loading: boolean;
  data: any;
}

export const initialState: State = {
  loading: true,
  data: []
};

export function cardsReducer(state = initialState, action: cardsActions.Actions) {
  switch (action.type) {
    case cardsActions.GET_ALL_CARDS:
      return {
        ...state,
        loading: true,
        data: action.payload
      };
    case cardsActions.GET_ALL_CARDS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload
      };
    case cardsActions.GET_ALL_CARDS_FAILED:
      return {
        ...state,
        loading: false,
        data: action.payload
      };
    case cardsActions.CREATE_CARD:
      return {
        ...state,
        loading: true,
        data: action.payload
      };
    case cardsActions.CREATE_CARD_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload
      };
    case cardsActions.CREATE_CARD_FAILED:
      return {
        ...state,
        loading: false,
        data: action.payload
      };
    case cardsActions.DELETE_CARD:
      return {
        ...state,
        loading: true,
        data: action.payload
      };
    case cardsActions.DELETE_CARD_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload
      };
    case cardsActions.DELETE_CARD_FAILED:
      return {
        ...state,
        loading: false,
        data: action.payload
      };
    case cardsActions.UPDATE_CARD:
      return {
        ...state,
        loading: true,
        data: action.payload
      };
    case cardsActions.UPDATE_CARD_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload
      };
    case cardsActions.UPDATE_CARD_FAILED:
      return {
        ...state,
        loading: false,
        data: action.payload
      };
    default:
      return {
        ...state
      };
  }
}

export const cardReducerData = (state: State) => state;
