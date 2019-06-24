import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as loginReducer from './store/reducers/login.reducer';
import * as deviceReducer from './store/reducers/device-size.reducer';
import * as chartReducer from './store/reducers/chart-reducer';

export interface State {
  chartReducer: chartReducer.State;
  loginReducer: loginReducer.State;
  deviceReducer: deviceReducer.State;
}

export const Reducers: ActionReducerMap<State> = {
  chartReducer: chartReducer.chartReducer,
  loginReducer: loginReducer.loadingReducer,
  deviceReducer: deviceReducer.deviceSizeReducer,
};

export const getLoginReducer = createFeatureSelector<loginReducer.State>('loginReducer');
export const getDeviceReducer = createFeatureSelector<deviceReducer.State>('deviceReducer');
export const getChartReducer = createFeatureSelector<chartReducer.State>('chartReducer');
export const getDeviceSize = createSelector(getDeviceReducer, deviceReducer.getDeviceSize);
export const getChartsData = createSelector(getChartReducer, chartReducer.getChartsData);
export const getIsLoading = createSelector(getLoginReducer, loginReducer.getIsLoading);
