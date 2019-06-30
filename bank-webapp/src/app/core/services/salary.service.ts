import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { SalaryModel } from '../../shared/models/salary.model';
import { environment } from '../../../environments/environment';

const backendUrl = environment.backendUrlSalary;

@Injectable({providedIn: 'root'})
export class SalaryService {

  constructor(private http: HttpClient) {}


  createNewSalary(salaryData: SalaryModel) {
    return this.http.post<{message: SalaryModel}>(backendUrl, salaryData);
  }

  get() {
    return this.http.get<{message: SalaryModel}>(backendUrl);
  }
}
