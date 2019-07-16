import { MatDialog } from '@angular/material';
import { Component } from '@angular/core';
import { RegisterUserModalComponent } from 'src/app/shared/modals/register-user/register-user.component';
import { LoginModalComponent } from 'src/app/shared/modals/login/login.component';

@Component({

  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})

export class MainMenuComponent {


  constructor(public dialog: MatDialog) { }
  register() {
    this.dialog.open(RegisterUserModalComponent);


  }
  login() {
    this.dialog.open(LoginModalComponent);
  }
}


