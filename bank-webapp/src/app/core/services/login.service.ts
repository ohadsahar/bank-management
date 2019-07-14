import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginModel } from 'src/app/shared/models/login-data.model';
import { environment } from 'src/environments/environment';

const  backendUrlLogin = environment.backendUrlLogin;
@Injectable({providedIn: 'root'})
export class LoginService {

  constructor(private http: HttpClient) {}

  login(loginData: LoginModel) {
    return this.http.post<{message: any}>(backendUrlLogin, loginData);
  }
}
