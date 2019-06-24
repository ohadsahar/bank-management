import {
  UIActions, MOBILE_DETECTED, DESKTOP_DETECTED,
} from '../actions/login.actions';


export interface State {
  mobile: boolean;
}

const initialState: State = {
  mobile: false
};

export function deviceSizeReducer(state = initialState, action: UIActions) {

  switch (action.type) {
    case MOBILE_DETECTED:
      return {
        ...state,
        mobile: true,
      };
    case DESKTOP_DETECTED:
      return {
        ...state,
        mobile: false,
      };

  }
}

export const getDeviceSize = (state: State) => state.mobile;

