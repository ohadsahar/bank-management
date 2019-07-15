import { Injectable } from '@angular/core';
import { Bank } from '../../shared/models/bank-data.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponseModel } from '../../shared/models/response.model';
import { TranscationTransform } from '../../shared/models/response-get.model';
import { ChartByCardName } from '../../shared/models/chart-by-cardname.model';
import { BankResponse } from '../../shared/models/bank-response.model';
import { FirstFetch } from '../../shared/models/first-fetch.model';

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
    return this.http.get<{message: ChartByCardName}>(`${backendUrl}charts/${email}`);
  }

}
