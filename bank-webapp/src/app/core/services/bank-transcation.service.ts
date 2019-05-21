import { Injectable } from '@angular/core';
import { Bank } from '../../shared/models/bank-data.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponseModel } from '../../shared/models/response.model';

const backendUrl = environment.backendUrl;

@Injectable({providedIn: 'root'})

export class BankTranscationService {

  constructor(private http: HttpClient) {}
  registerNewTranscation(transcationData: Bank) {
    return this.http.post<{message: Bank}>(`${backendUrl}transcation`, transcationData);
  }

  getTranscations() {
    return this.http.get<{message: ResponseModel}>(`${backendUrl}`);
  }

}
