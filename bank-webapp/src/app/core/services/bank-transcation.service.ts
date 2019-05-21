import { Injectable } from '@angular/core';
import { Bank } from '../../shared/models/bank-data.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponseModel } from '../../shared/models/response.model';
import { TranscationTransform } from '../../shared/models/response-get.model';

const backendUrl = environment.backendUrl;

@Injectable({providedIn: 'root'})

export class BankTranscationService {

  constructor(private http: HttpClient) {}
  registerNewTranscation(transcationData: Bank) {
    return this.http.post<{message: Bank}>(`${backendUrl}transcation`, transcationData);
  }

  deleteTranscation(transcationId: string) {
    return this.http.delete<{message: ResponseModel}>(`${backendUrl}${transcationId}`);
  }

  getTranscations() {
    return this.http.get<{message: TranscationTransform}>(`${backendUrl}`);
  }

}
