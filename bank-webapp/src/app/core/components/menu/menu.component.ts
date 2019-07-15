import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})

export class MenuComponent implements OnInit {
  @Output() event: EventEmitter<boolean> = new EventEmitter();
  constructor(private router: Router, private loginService: LoginService) {}
  ngOnInit() {
    this.sendDataToAppComponent(true);
    this.router.navigate(['management']);
  }
  changedTab(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.router.navigate(['management']);
    }
    if (event.index === 1) {
      this.router.navigate(['payment']);
    }
    if (event.index === 2) {
      this.router.navigate(['salary']);
    }
    if (event.index === 3) {
      this.loginService.logout();
      this.sendDataToAppComponent(false);
    }
  }
  sendDataToAppComponent(value: boolean) {
    this.event.emit(value);
  }
}

