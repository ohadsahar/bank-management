import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const backendUrlHome = environment.backendUrlHome;

@Injectable({ providedIn: 'root' })

export class HomePageService {
  constructor(private http: HttpClient) { }
  getQuickInformation(username: string) {
    return this.http.get<{ message: any }>(`${backendUrlHome}/${username}`);
  }
}
