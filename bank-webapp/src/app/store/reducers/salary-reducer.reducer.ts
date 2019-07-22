import {
  SalaryActions, REGISTER_NEW_SALARY, REGISTER_NEW_SALARY_SUCCESS,
  REGISTER_NEW_SALARY_FAILED, UPDATE_SALARY, UPDATE_SALARY_SUCCESS, UPDATE_SALARY_FAILED,
  DELETE_SALARY, DELETE_SALARY_FAILED, DELETE_SALARY_SUCCESS
} from './../actions/salary.actions';

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

export function salaryReducer(state = initialState, action: SalaryActions) {
  switch (action.type) {
    case REGISTER_NEW_SALARY:
      return {
        ...state,
        loading: true,
        loaded: false,
        data: action.payload
      };
    case REGISTER_NEW_SALARY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case REGISTER_NEW_SALARY_FAILED:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case UPDATE_SALARY:
      return {
        ...state,
        loading: true,
        loaded: false,
        data: action.payload
      };
    case UPDATE_SALARY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case UPDATE_SALARY_FAILED:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case DELETE_SALARY:
      return {
        ...state,
        loading: true,
        loaded: false,
        data: action.payload
      };
    case DELETE_SALARY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    case DELETE_SALARY_FAILED:
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

