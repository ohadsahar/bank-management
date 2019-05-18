import { Action } from '@ngrx/store';
export const START_LOADING = ' [UI] Start Loading';
export const STOP_LOADING = ' [UI] Stop Loading';
export const MOBILE_DETECTED = ' [UI] Mobile';
export const DESKTOP_DETECTED = ' [UI] Desktop';

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

export type UIActions = StartLoading | StopLoading | Mobile | Desktop;
