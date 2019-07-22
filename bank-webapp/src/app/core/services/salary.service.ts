import { SalaryData } from 'src/app/shared/models/edit-salary.model';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { SalaryModel } from '../../shared/models/salary.model';
import { environment } from '../../../environments/environment';
import { SalaryPost } from 'src/app/shared/models/salary-post.model';

const backendUrl = environment.backendUrlSalary;

@Injectable({ providedIn: 'root' })
export class SalaryService {

  constructor(private http: HttpClient) { }

  registerSalary(salaryData: SalaryPost) {
    return this.http.post<{ message: SalaryModel }>(backendUrl, salaryData);
  }
  get(username: string) {
    return this.http.get<{ message: any }>(`${backendUrl}/${username}`);
  }
  deleteSalary(salaryId: string) {
    return this.http.delete<{ message: string }>(`${backendUrl}/${salaryId}`);
  }
  updateSalary(salaryData: SalaryData) {
    return this.http.put<{ message: SalaryData }>(`${backendUrl}`, salaryData);
  }


}
