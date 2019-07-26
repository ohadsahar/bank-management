import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { OldTransactionData } from '../../shared/models/old-transaction-data.model';
const backendUrl = environment.backendUrlArchive;

@Injectable({providedIn: 'root'})
export class PaymentTransactionArchiveService {
  constructor(private http: HttpClient) {}

  getAllArchiveTransactions(username: string) {
    return this.http.get<{message: OldTransactionData}>(`${backendUrl}/${username}`);
  }
}
