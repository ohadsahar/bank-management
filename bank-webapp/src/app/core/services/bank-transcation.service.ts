import { Injectable } from '@angular/core';
import { Bank } from '../../shared/models/bank-data.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponseModel } from '../../shared/models/response.model';
import { TranscationTransform } from '../../shared/models/response-get.model';
import { ChartByCardName } from '../../shared/models/chart-by-cardname.model';
import { BankResponse } from '../../shared/models/bank-response.model';

const backendUrl = environment.backendUrl;

@Injectable({providedIn: 'root'})

export class BankTranscationService {

  constructor(private http: HttpClient) {}
  registerNewTranscation(transcationData: Bank) {
    return this.http.post<{message: Bank}>(`${backendUrl}transcation`, transcationData);
  }

  updateTransaction(transactionData: Bank) {
      return this.http.put<{message: BankResponse}>(backendUrl, transactionData);
  }

  deleteTranscation(transcationId: string) {
    return this.http.delete<{message: ResponseModel}>(`${backendUrl}${transcationId}`);
  }

  getTranscations() {
    return this.http.get<{message: TranscationTransform, chartData: ChartByCardName}>(`${backendUrl}`);
  }

  getCharts() {
    return this.http.get<{message: ChartByCardName}>(`${backendUrl}charts`);
  }

}
