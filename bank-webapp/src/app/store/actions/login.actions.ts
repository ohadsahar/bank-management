import { Action } from '@ngrx/store';
export const START_LOADING = ' [UI] Start Loading';
export const STOP_LOADING = ' [UI] Stop Loading';
export const MOBILE_DETECTED = ' [UI] Mobile';
export const DESKTOP_DETECTED = ' [UI] Desktop';
export const GET_CHARTS = '[UI] Get CHART';
export const GET_CHARTS_SUCCESS = '[UI] Transaction';
export const GET_CHART_FAILED = '[UI] failed!';

export class StartLoading implements Action {
  readonly type = START_LOADING;
}

export class StopLoading implements Action {
  readonly type = STOP_LOADING;
}

export class Mobile implements Action {
  readonly type = MOBILE_DETECTED;
}

export class Desktop implements Action {
  readonly type = DESKTOP_DETECTED;

}

export class GetCharts implements Action {

  readonly type = GET_CHARTS;
}

export class ChartSuccess implements Action {
  readonly type = GET_CHARTS_SUCCESS;
  constructor(public payload: any) {}
}

export class ChartFailed implements Action {
  readonly type = GET_CHART_FAILED;
  constructor(public payload: any) {}
}


export type UIActions = StartLoading | StopLoading | Mobile | Desktop | ChartSuccess | GetCharts | ChartFailed;
