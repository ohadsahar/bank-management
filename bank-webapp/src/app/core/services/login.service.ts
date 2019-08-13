import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { LoginModel } from 'src/app/shared/models/login-data.model';
import { environment } from 'src/environments/environment';
import { AuthData } from './../../shared/models/auth-data.model';
import { MessageService } from './message.service';

const backendUrlLogin = environment.backendUrlLogin;
@Injectable({ providedIn: 'root' })
export class LoginService {
  private token: string;
  private expiryDate: Date;
  private tokenTimer: any;
  private loggedUserSource = new BehaviorSubject(false);
  currentStatus = this.loggedUserSource.asObservable();
  private authStatusListener = new Subject<boolean>();
  private isLogged: boolean;
  private username: string;
  private id: string;

  constructor(private http: HttpClient, private router: Router, private messageService: MessageService, private dialog: MatDialog) {
    this.isLogged = false;
    this.changeStatus(false);
  }
  login(loginData: LoginModel) {
    this.http.post<{ message: AuthData }>(backendUrlLogin, loginData).subscribe(response => {
      const token = response.message.token;
      this.token = token;
      if (token) {
        this.isLogged = true;
        this.changeStatus(true);
        this.username = response.message.username;
        this.id = response.message.id;
        const expiryTokenTime = response.message.expiresIn;
        this.setAuthTimer(expiryTokenTime);
        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, expiryTokenTime * 1000);
        const now = new Date();
        this.expiryDate = new Date(now.getTime() + expiryTokenTime * 1000);
        this.saveAuthData(this.token, this.expiryDate);
        this.authStatusListener.next(true);
        this.messageService.successMessage('התחברת בהצלחה!', 'סגור');
        this.dialog.closeAll();
      }
    }, (error) => {
      this.messageService.failedMessage('שם המשתמש או הסיסמא לא נכונים', 'סגור');
    });
  }
  register(loginData: LoginModel) {
    return this.http.post<{ message: any }>(`${backendUrlLogin}/register`, loginData);
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
        this.changeStatus(true);
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
      }
    }
  }
  logout() {
    this.token = null;
    this.isLogged = false;
    this.changeStatus(false);
    this.authStatusListener.next(false);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.router.navigate(['']);
  }
  getUsernameAndId() {
    const loggedUser = {
      username: localStorage.getItem('username'),
      id: localStorage.getItem('id')
    };
    return loggedUser;
  }
  getIsLogged() {
    return this.isLogged;
  }
  changeStatus(value: boolean) {
    this.loggedUserSource.next(value);
  }
  private saveAuthData(token: string, expirateionDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiryDate', expirateionDate.toISOString());
    localStorage.setItem('username', this.username);
    localStorage.setItem('id', this.id);
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
    localStorage.removeItem('username');
    localStorage.removeItem('id');
  }
}
