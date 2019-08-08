import { CardsModel } from './../../shared/models/cards.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Bank } from 'src/app/shared/models/bank-data.model';
import { CategoriesModel } from 'src/app/shared/models/categories.model';
import { OptionModel } from 'src/app/shared/models/option.model';
@Injectable({ providedIn: 'root' })
export class ShareDataService {
  private passCards = new BehaviorSubject<CardsModel>(null);
  private passTransactions = new BehaviorSubject<any>(null);
  private passDestroyCharts = new BehaviorSubject<boolean>(false);
  private passSalaryCharts = new BehaviorSubject<any>(null);
  private passDestroySalaryCharts = new BehaviorSubject<boolean>(false);
  private passCurrentCash = new BehaviorSubject<number>(0);
  private passCategories = new BehaviorSubject<CategoriesModel>(null);
  private passOptions = new BehaviorSubject<OptionModel>(null);


  currentStatusOfDestroy = this.passDestroyCharts.asObservable();
  currentTransactions = this.passTransactions.asObservable();
  currentSalary = this.passSalaryCharts.asObservable();
  currentStatusDestroySalaryCharts = this.passDestroySalaryCharts.asObservable();
  currentCashToPass = this.passCurrentCash.asObservable();
  currentCategories = this.passCategories.asObservable();
  currentOptions = this.passOptions.asObservable();
  currentCards = this.passCards.asObservable();
  constructor() { }

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
  changeCurrentCash(value: number) {
    this.passCurrentCash.next(Number(value.toFixed(2)));
  }
  changeOptions(value: OptionModel) {
    this.passOptions.next(value);
  }
  changeCategories(value: CategoriesModel) {
    this.passCategories.next(value);
  }
  changeCards(value: CardsModel) {
    this.passCards.next(value);
  }
}
