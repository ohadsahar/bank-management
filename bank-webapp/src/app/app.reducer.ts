import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as loginReducer from './store/reducers/login.reducer';
import * as chartReducer from './store/reducers/chart-reducer';
import * as transactionReducer from './store/reducers/transaction.reducer';
import * as transactionFetchedReducer from './store/reducers/transaction-fetch.reducer';
import * as salaryReducer from './store/reducers/salary-reducer.reducer';
import * as cardsReducer from './store/reducers/cards.reducer';
export interface State {
  chartReducer: chartReducer.State;
  loginReducer: loginReducer.State;
  transactionReducer: transactionReducer.State;
  transactionFetchedReducer: transactionFetchedReducer.State;
  salaryReducer: salaryReducer.State;
  cardsReducer: cardsReducer.State;
}
export const Reducers: ActionReducerMap<State> = {
  chartReducer: chartReducer.chartReducer,
  loginReducer: loginReducer.loadingReducer,
  transactionReducer: transactionReducer.transactionReducer,
  transactionFetchedReducer: transactionFetchedReducer.transactionFetchReducer,
  salaryReducer: salaryReducer.salaryReducer,
  cardsReducer: cardsReducer.cardsReducer
};

export const getTransactionReducer = createFeatureSelector<transactionReducer.State>('transactionReducer');
export const getLoginReducer = createFeatureSelector<loginReducer.State>('loginReducer');
export const getChartReducer = createFeatureSelector<chartReducer.State>('chartReducer');
export const getTransactionFetchedReducer = createFeatureSelector<transactionFetchedReducer.State>('transactionFetchedReducer');
export const getSalaryReducer = createFeatureSelector<salaryReducer.State>('salaryReducer');
export const getCardsReducer = createFeatureSelector<cardsReducer.State>('cardsReducer');


export const getChartsData = createSelector(getChartReducer, chartReducer.getChartsData);
export const getIsLoading = createSelector(getLoginReducer, loginReducer.getIsLoading);
export const newTransactionData = createSelector(getTransactionReducer, transactionReducer.newTransactionData);
export const fetchedTransaction = createSelector(getTransactionFetchedReducer, transactionFetchedReducer.fetchedTransaction);
export const getSalaryData = createSelector(getSalaryReducer, salaryReducer.getSalaryData);
export const getCardsData = createSelector(getCardsReducer, cardsReducer.cardReducerData);
