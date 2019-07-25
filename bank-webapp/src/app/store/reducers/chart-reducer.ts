import * as chartActions from '../actions/chart.actions';
export interface State {
  data: any;
  loading: boolean;
  loaded: boolean;
}
const initialState: State = {
  data: [],
  loading: false,
  loaded: false
}
export function chartReducer(state = initialState, action: chartActions.Actions) {
  switch (action.type) {
    case chartActions.GET_CHARTS:
      return {
        ...state,
        loading: true,
        loaded: false
      };
    case chartActions.GET_CHARTS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case chartActions.GET_CHART_FAILED:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload,
      };
    default:
      return state;
  }
}
export const getChartsData = (state: State) => state;
