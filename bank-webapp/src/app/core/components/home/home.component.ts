
import { HomePageService } from './../../services/home-page.service';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '@app/services/login.service';
import { ShareDataService } from '@app/services/share-data.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomePageComponent implements OnInit {
  username: string;
  categoryLargestExpenditure: number;
  categoryLargestExpenditureCategory: string;
  totalSalaryCurrentMonth: number;
  totalExpenseCurrentMonth: number;
  minimumExpenseCurrentMonthCash: number;
  minimumExpenseCurrentMonthCashType: string;
  saveCurrentMonth: number;
  constructor(private homePageService: HomePageService, private loginService: LoginService, private shareDataService: ShareDataService) {
  }

  ngOnInit() {
    this.onLoadComponent();
  }

  onLoadComponent() {
    this.username = this.loginService.getUsernameAndId().username;
    this.homePageService.getQuickInformation(this.username).subscribe(response => {
      this.minimumExpenseCurrentMonthCash = response.message.resultOfCurrentCategoryExpense.minimumExpense.price;
      this.minimumExpenseCurrentMonthCashType = response.message.resultOfCurrentCategoryExpense.minimumExpense.typeProduct;
      this.totalExpenseCurrentMonth = response.message.resultOfCurrentCategoryExpense.totalExpenseCash;
      this.categoryLargestExpenditure = response.message.resultOfCurrentCategoryExpense.largestExpense.price;
      this.categoryLargestExpenditureCategory = response.message.
        resultOfCurrentCategoryExpense.largestExpense.typeProduct;
      this.totalSalaryCurrentMonth = response.message.resultOfCurrentCategoryExpense.salaryTotal.salary;
      this.saveCurrentMonth = this.totalSalaryCurrentMonth - this.totalExpenseCurrentMonth;
      this.shareDataService.changeCurrentCash(this.totalExpenseCurrentMonth);
    });
  }
}
