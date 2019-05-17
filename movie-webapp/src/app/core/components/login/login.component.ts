import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs';
import * as fromRoot from '../../../app.reducer';
import * as loginActions from '../../../shared/actions/login.actions';
import { MessageService } from '../../services/message.service';
import * as validateUtil from './validate.functions';

@Component({

  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class LoginComponent implements OnInit {


  hide: boolean;
  public isLoading$: Observable<boolean>;
  public isMobile$: Observable<boolean>;
  constructor(private messageService: MessageService, private store: Store<fromRoot.State>,
              private spinnerService: Ng4LoadingSpinnerService,  private deviceService: DeviceDetectorService) {
    this.hide = true;
  }

  ngOnInit() {
      this.mobileOrDesktop();
  }
  Login(form: NgForm) {

    if (form.invalid) {
      return;
    } else {
      if (validateUtil.validateAuthData(form)) {
          this.messageService.successMessage('You have successfully connected to the system.', 'Dismiss');
      } else {
        this.messageService.failedMessage('One of the details you entered is incorrect.', 'Dismiss');
      }
    }
  }
  loading() {

    this.spinnerService.show();
    this.store.dispatch(new loginActions.StartLoading());
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
  }
  stopLoading() {

    this.spinnerService.hide();
    this.store.dispatch(new loginActions.StopLoading());
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
  }
  mobileOrDesktop() {
    if (this.deviceService.isMobile()) {
      this.store.dispatch(new loginActions.Mobile());
      this.isMobile$ = this.store.select(fromRoot.getDeviceSize);
    } else {
      this.store.dispatch(new loginActions.Desktop());
      this.isMobile$ = this.store.select(fromRoot.getDeviceSize);
    }

  }
}
