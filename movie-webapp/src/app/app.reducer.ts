import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as loginReducer from './store/reducers/login.reducer';
import * as deviceReducer from './store/reducers/device-size.reducer';

export interface State {

   loginReducer: loginReducer.State;
   deviceReducer: deviceReducer.State;

}

export const Reducers: ActionReducerMap<State> = {

  loginReducer: loginReducer.loadingReducer,
  deviceReducer: deviceReducer.deviceSizeReducer,
};

export const getLoginReducer = createFeatureSelector<loginReducer.State>('loginReducer');
export const getDeviceReducer = createFeatureSelector<deviceReducer.State>('deviceReducer');
export const getDeviceSize = createSelector(getDeviceReducer, deviceReducer.getDeviceSize);
export const getIsLoading = createSelector(getLoginReducer, loginReducer.getIsLoading);
