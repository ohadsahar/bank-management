
import { HomePageService } from './../../services/home-page.service';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '@app/services/login.service';


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
  constructor(private homePageService: HomePageService, private loginService: LoginService) {
  }

  ngOnInit() {
    this.onLoadComponent();
  }

  onLoadComponent() {
    this.username = this.loginService.getUsernameAndId().username;
    this.homePageService.getQuickInformation(this.username).subscribe(response => {
      this.categoryLargestExpenditure = response.message.resultOfCurrentCategoryExpense.largestExpense.price;
      this.categoryLargestExpenditureCategory = response.message.
        resultOfCurrentCategoryExpense.largestExpense.typeProduct;
      this.totalSalaryCurrentMonth = response.message.resultOfCurrentCategoryExpense.salaryTotal.salary;
    });
  }
}
