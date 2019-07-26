import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BankResponse } from '../../shared/models/bank-response.model';
import { FirstFetch } from '../../shared/models/first-fetch.model';
import { ResponseModel } from '../../shared/models/response.model';
import { Bank } from './../../shared/models/bank-data.model';
const backendUrl = environment.backendUrl;
@Injectable({providedIn: 'root'})

export class BankTranscationService {

  constructor(private http: HttpClient) {}
  registerNewTransaction(transactionData: Bank) {
    return this.http.post<{message: Bank}>(`${backendUrl}transaction`, transactionData);
  }
  updateTransaction(transactionData: Bank) {
      return this.http.put<{message: BankResponse}>(backendUrl, transactionData);
  }
  deleteTransaction(transactionId: string) {
    return this.http.delete<{message: ResponseModel}>(`${backendUrl}${transactionId}`);
  }
  getTransactions(email: string) {
    return this.http.get<{message: FirstFetch}>(`${backendUrl}/${email}`);
  }
  getCharts(email: string) {
    return this.http.get<{message: any}>(`${backendUrl}charts/${email}`);
  }
}
