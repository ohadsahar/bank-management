import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as validator from '../../../shared/validate/validate-register.function';
import { ResponseRegisterModel } from '../../models/register-response.model';
import { LoginService } from './../../../core/services/login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})

export class LoginModalComponent {
  registerMessage: ResponseRegisterModel;
  hide = true;

  constructor(private loginService: LoginService) { }
  login(form: NgForm) {
    if (form.invalid) {
      return false;
    }
    if (validator.validateRegister(form.value)) {
      this.loginService.login(form.value);
    }
  }
}



