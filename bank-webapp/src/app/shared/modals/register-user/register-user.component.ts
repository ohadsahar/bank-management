import { LoginService } from './../../../core/services/login.service';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import * as validator from '../../../shared/validate/validate-register.function';
import { ResponseRegisterModel } from '../../models/register-response.model';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})

export class RegisterUserModalComponent {
  registerMessage: ResponseRegisterModel;
  hide = true;
  constructor(private loginService: LoginService) { }

  registerUser(form: NgForm) {
    if (form.invalid) {
      return false;
    }
    if (validator.validateRegister(form.value)) {
      this.loginService.register(form.value).subscribe(response => {
        this.registerMessage = response.message.resultOfCreationNewUser.message;
        const loginInfo = {username: response.message.registerData.username, password: response.message.registerData.password};
        this.loginService.login(loginInfo);
      },
        (error) => {

        });
    }
  }
}

