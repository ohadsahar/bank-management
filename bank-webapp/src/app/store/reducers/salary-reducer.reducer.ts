import * as salaryActions from '../actions/salary.actions';

export interface State {
  loading: boolean;
  loaded: boolean;
  data: any;
}
export const initialState: State = {
  loading: true,
  loaded: false,
  data: [],
};

export function salaryReducer(state = initialState, action: salaryActions.Actions) {
  switch (action.type) {
    case salaryActions.REGISTER_NEW_SALARY:
      return {
        ...state,
        loading: true,
        loaded: false,
        data: action.payload
      };
    case salaryActions.REGISTER_NEW_SALARY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case salaryActions.REGISTER_NEW_SALARY_FAILED:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case salaryActions.UPDATE_SALARY:
      return {
        ...state,
        loading: true,
        loaded: false,
        data: action.payload
      };
    case salaryActions.UPDATE_SALARY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case salaryActions.UPDATE_SALARY_FAILED:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case salaryActions.DELETE_SALARY:
      return {
        ...state,
        loading: true,
        loaded: false,
        data: action.payload
      };
    case salaryActions.DELETE_SALARY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case salaryActions.DELETE_SALARY_FAILED:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    default:
      return state;

  }
}

export const getSalaryData = (state: State) => state;

