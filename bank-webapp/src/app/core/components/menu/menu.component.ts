import { DisconnectDialogComponent } from './../../../shared/modals/disconnect/disconnect.component';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})

export class MenuComponent implements OnInit {
  public selectedTab: number;
  @Output() event: EventEmitter<boolean> = new EventEmitter();
  constructor(private router: Router, private loginService: LoginService, public dialog: MatDialog) { }
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
      this.selectedTab = 3;
      const dialog = this.dialog.open(DisconnectDialogComponent);
      dialog.afterClosed().subscribe(result => {
        if (result === true) {
          this.loginService.logout();
          this.sendDataToAppComponent(false);
        }
        if (result === false || result === undefined) {
          this.selectedTab = 0;
          event.index = 0;
          this.router.navigate(['management']);
        }
      });
    }
  }
  sendDataToAppComponent(value: boolean) {
    this.event.emit(value);
  }
}

