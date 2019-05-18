import { START_LOADING, STOP_LOADING, UIActions } from '../actions/login.actions';
export interface State {
  isLoading: boolean;
}
const initialState: State = {
  isLoading: false
};

export function loadingReducer(state = initialState, action: UIActions) {
  switch (action.type) {
    case START_LOADING:
      return {
        isLoading: true
      };
    case STOP_LOADING:
      return {
        isLoading: false
      };
    default: {
      return state;
    }
  }
}
export const getIsLoading = (state: State) => state.isLoading;


