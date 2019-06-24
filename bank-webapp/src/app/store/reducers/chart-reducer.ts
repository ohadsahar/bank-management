import { ChartActions, GET_CHARTS_SUCCESS, GET_CHARTS, GET_CHART_FAILED } from '../actions/chart.actions';

export interface State {

  data: any[],
  loading: boolean;
  loaded: boolean;
}

const initialState: State = {

  data: [],
  loading: false,
  loaded: false

}

export function chartReducer(state = initialState, action: ChartActions) {

  switch (action.type) {
    case GET_CHARTS:
      return {
        ...state,
        loading: true,
        loaded: false
      };

    case GET_CHARTS_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };

    case GET_CHART_FAILED:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload,
      };
  }
}

export const getChartsData = (state: State) => state;
