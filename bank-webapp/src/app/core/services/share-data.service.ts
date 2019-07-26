import { BehaviorSubject } from 'rxjs';
import { Injectable } from "@angular/core";
import { Bank } from 'src/app/shared/models/bank-data.model';



@Injectable({providedIn: 'root'})


export class ShareDataService {

  private passTransactions = new BehaviorSubject<any>(null);
  private passDestroyCharts = new BehaviorSubject<boolean>(false);
  private passSalaryCharts = new BehaviorSubject<any>(null);
  private passDestroySalaryCharts = new BehaviorSubject<boolean>(false);
  currentStatusOfDestroy = this.passDestroyCharts.asObservable();
  currentTransactions = this.passTransactions.asObservable();
  currentSalary = this.passSalaryCharts.asObservable();
  currentStatusDestroySalaryCharts = this.passDestroySalaryCharts.asObservable();


  constructor() {}

  changeTransactions(transactions: Bank) {
    this.passTransactions.next(transactions);
  }

  changeDestroy(value: boolean) {
    this.passDestroyCharts.next(value);
  }

  changeSalary(salaries: any) {
    this.passSalaryCharts.next(salaries);
  }
  changeSalaryDestroyStatus(value: boolean) {
    this.passDestroySalaryCharts.next(value);
  }
}
