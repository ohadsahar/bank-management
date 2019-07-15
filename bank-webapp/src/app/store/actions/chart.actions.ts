import { Action } from '@ngrx/store';
export const GET_CHARTS = 'LOAD_CHARTS';
export const GET_CHARTS_SUCCESS = 'LOAD_CHARTS_SUCCESS';
export const GET_CHART_FAILED = 'LOAD_CHARTS_FAILED!';

export class GetCharts implements Action {
  readonly type = GET_CHARTS;
  constructor(public payload: any) {
  }
}

export class ChartSuccess implements Action {
  readonly type = GET_CHARTS_SUCCESS;
  constructor(public payload: any) {;
  }
}

export class ChartFailed implements Action {
  readonly type = GET_CHART_FAILED;
  constructor(public payload: any) {}
}


export type ChartActions =  ChartSuccess | GetCharts | ChartFailed;
