import { NgForm } from '@angular/forms';
import * as validator from 'validator';

export function validateAuthData(form: NgForm) {

  if ((validator.isEmail(form.value.username)) && validator.isLength(form.value.password, {min: 8, max: 8})) {
    return true;
  } else {
    return false;
  }


}
