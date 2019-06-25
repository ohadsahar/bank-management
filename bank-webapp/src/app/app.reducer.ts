import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as loginReducer from './store/reducers/login.reducer';
import * as deviceReducer from './store/reducers/device-size.reducer';
import * as chartReducer from './store/reducers/chart-reducer';
import * as transactionReducer from './store/reducers/transaction.reducer';

export interface State {
  chartReducer: chartReducer.State;
  loginReducer: loginReducer.State;
  deviceReducer: deviceReducer.State;
  transactionReducer: transactionReducer.State;
}

export const Reducers: ActionReducerMap<State> = {
  chartReducer: chartReducer.chartReducer,
  loginReducer: loginReducer.loadingReducer,
  deviceReducer: deviceReducer.deviceSizeReducer,
  transactionReducer: transactionReducer.transactionReducer
};

export const getTransactionReducer = createFeatureSelector<transactionReducer.State>('transactionReducer');
export const getLoginReducer = createFeatureSelector<loginReducer.State>('loginReducer');
export const getDeviceReducer = createFeatureSelector<deviceReducer.State>('deviceReducer');
export const getChartReducer = createFeatureSelector<chartReducer.State>('chartReducer');
export const getDeviceSize = createSelector(getDeviceReducer, deviceReducer.getDeviceSize);
export const getChartsData = createSelector(getChartReducer, chartReducer.getChartsData);
export const getIsLoading = createSelector(getLoginReducer, loginReducer.getIsLoading);
export const newTransactionData = createSelector(getTransactionReducer, transactionReducer.newTransactionData);
