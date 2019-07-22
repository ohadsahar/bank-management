import { LoginService } from './core/services/login.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'bank-management';
  isLogged: boolean;

 constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.loginService.autoAuthUser();
    this.loginService.currentStatus.subscribe(response => {
      this.isLogged = response;
    });
  }
  setDataLoggedIn(data) {
    this.isLogged = data;
  }
}
