import { LoginModel } from '../models/login-data.model';
import * as validator from 'validator';

export function validateRegister(loginData: LoginModel) {
  if (validator.isEmail(loginData.username) && validator.isLength(loginData.password, { min: 8, max: 8 })) {
    return true;
  }
  return false;
}

