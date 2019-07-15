import { AuthData } from './../../shared/models/auth-data.model';
import { ResponseRegisterModel } from './../../shared/models/register-response.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginModel } from 'src/app/shared/models/login-data.model';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';



const backendUrlLogin = environment.backendUrlLogin;
@Injectable({ providedIn: 'root' })
export class LoginService {

  private token: string;
  private expiryDate: Date;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private isLogged: boolean;

  constructor(private http: HttpClient, private router: Router) {
    this.isLogged = false
  }


  login(loginData: LoginModel) {
    this.http.post<{ message: AuthData }>(backendUrlLogin, loginData).subscribe(response => {
      const token = response.message.token;
      this.token = token;
      if (token) {
        this.isLogged = true;
        const expiryTokenTime = response.message.expiresIn;
        this.setAuthTimer(expiryTokenTime);
        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, expiryTokenTime * 1000);
        const now = new Date();
        this.expiryDate = new Date(now.getTime() + expiryTokenTime * 1000);
        this.saveAuthData(this.token, this.expiryDate);
        this.authStatusListener.next(true);
        this.router.navigate(['/menu']);
        location.reload();
      }
    }, (error) => {
    });
  }
  register(loginData: LoginModel) {
    return this.http.post<{ message: ResponseRegisterModel }>(`${backendUrlLogin}/register`, loginData);
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    const now = new Date();
    if (authInformation) {
      const expiresIn = authInformation.expiryDate.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.token = authInformation.token;
        this.isLogged = true;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
      }
    }
  }
  private saveAuthData(token: string, expirateionDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiryDate', expirateionDate.toISOString());
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiryDate = localStorage.getItem('expiryDate');
    if (!token || !expiryDate) {
      return;
    }
    return { token, expiryDate: new Date(expiryDate) };
  }
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
  }
  logout() {
    this.token = null;
    this.isLogged = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.router.navigate(['']);
  }
  getIsLogged() {
    return this.isLogged;
  }
}
