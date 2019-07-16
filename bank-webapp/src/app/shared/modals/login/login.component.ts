import { LoginService } from './../../../core/services/login.service';
import { NgForm } from '@angular/forms';
import { Component, Output, EventEmitter } from '@angular/core';
import * as validator from '../../../shared/validate/validate-register.function';
import { ResponseRegisterModel } from '../../models/register-response.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginModalComponent {
  registerMessage: ResponseRegisterModel;
  hide = true;
  @Output() event: EventEmitter<boolean> = new EventEmitter();
  constructor(private loginService: LoginService) { }
  login(form: NgForm) {
    if (form.invalid) {
      return false;
    }
    if (validator.validateRegister(form.value)) {
      this.loginService.login(form.value);
      this.sendDataToAppComponent(true);
    }
  }
  sendDataToAppComponent(value: boolean) {
    this.event.emit(value);
  }
}



