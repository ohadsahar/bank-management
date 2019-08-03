import { DisconnectDialogComponent } from './../../../shared/modals/disconnect/disconnect.component';
import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { DeviceDetectorService } from 'ngx-device-detector'
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})

export class MenuComponent implements OnInit {
  public selectedTab: number;
  isMobile: boolean;
  constructor(private router: Router, private loginService: LoginService, public dialog: MatDialog,
    private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile();
  }
  ngOnInit() {
    this.selectedTab = 0;
    this.router.navigate(['user-home/home']);
  }
  changedTab(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.router.navigate(['user-home/home']);
    }
    if (event.index === 1) {
      this.router.navigate(['user-management/management']);
    }
    if (event.index === 2) {
      this.router.navigate(['user-payment/payment']);
    }
    if (event.index === 3) {
      this.router.navigate(['user-salary/salary']);
    }
    if (event.index === 4) {
      this.router.navigate(['user-chart/chart']);
    }
    if (event.index === 5) {
      this.selectedTab = 5;
      this.disconnect();
    }
  }

  disconnect() {
    const dialog = this.dialog.open(DisconnectDialogComponent);
    dialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.loginService.logout();
      }
      if (result === false || result === undefined) {
        this.selectedTab = 0;
        this.router.navigate(['user-management/management']);
      }
    });
  }
}

