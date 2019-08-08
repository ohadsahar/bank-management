import { Component, OnInit } from '@angular/core';
import { LoginService } from '@app/services/login.service';
import { ShareDataService } from '@app/services/share-data.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HomePageService } from './../../services/home-page.service';
import { MessageService } from './../../services/message.service';



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
  isLoading: boolean;
  constructor(private homePageService: HomePageService, private loginService: LoginService, private shareDataService: ShareDataService,
              private messageService: MessageService, private spinnerService: Ng4LoadingSpinnerService) {
    this.isLoading = false;
  }

  ngOnInit() {
    this.onLoadComponent();
  }
  onLoadComponent() {
    this.loading();
    this.username = this.loginService.getUsernameAndId().username;
    this.homePageService.getQuickInformation(this.username).subscribe(response => {
      if (response.message.resultOfCurrentCategoryExpense.minimumExpense) {
        this.minimumExpenseCurrentMonthCashType = response.message.resultOfCurrentCategoryExpense.minimumExpense.typeProduct;
        this.minimumExpenseCurrentMonthCash = response.message.resultOfCurrentCategoryExpense.minimumExpense.price;
      }
      this.totalExpenseCurrentMonth = response.message.resultOfCurrentCategoryExpense.totalExpenseCash;
      if (response.message.resultOfCurrentCategoryExpense.largestExpense) {
        this.categoryLargestExpenditure = response.message.resultOfCurrentCategoryExpense.largestExpense.price;
        this.categoryLargestExpenditureCategory = response.message.
          resultOfCurrentCategoryExpense.largestExpense.typeProduct;
      }
      if (response.message.resultOfCurrentCategoryExpense.salaryTotal !== undefined) {
        this.totalSalaryCurrentMonth = response.message.resultOfCurrentCategoryExpense.salaryTotal.salary;
        this.saveCurrentMonth = this.totalSalaryCurrentMonth - this.totalExpenseCurrentMonth;
        this.saveCurrentMonth = Number(this.saveCurrentMonth.toFixed(2));
      }
      this.shareDataService.changeCurrentCash(this.totalExpenseCurrentMonth);
      this.loaded();
    }, (error) => {
      this.loaded();
      this.messageService.failedMessage(error, 'Dismiss');
    });
  }
  loading() {
    this.isLoading = true;
    this.spinnerService.show();
  }
  loaded() {
    this.isLoading = false;
    this.spinnerService.hide();
  }
}
