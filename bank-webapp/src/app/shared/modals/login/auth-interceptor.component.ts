import { LoginService } from './../../../core/services/login.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = localStorage.getItem('token');
    const authRequest = req.clone({headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next.handle(authRequest).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.status === 400) {
            this.loginService.logout();
            return;
          }
          if (event.status === 401) {
            this.loginService.logout();
            return;
          }
          if (event.status === 403) {
            this.loginService.logout();
            return;
          }
        }
        return event;
      }));
  }

}
