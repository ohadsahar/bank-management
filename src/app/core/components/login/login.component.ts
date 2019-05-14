import { Component, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as validateUtil from './validate.functions';
import { MessageService } from '../../services/message.service';

@Component({

  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class LoginComponent {

  hide: boolean;
  constructor(private messageService: MessageService) {
    this.hide = true;
  }

  Login(form: NgForm) {

    if (form.invalid) {
      return;
    } else {
      if (validateUtil.validateAuthData(form)) {
          this.messageService.loginSuccessMessage('You have successfully connected to the system.', 'Dismiss');
      } else {
        this.messageService.loginFailedMessage('One of the details you entered is incorrect.', 'Dismiss');
      }
    }
  }
}
