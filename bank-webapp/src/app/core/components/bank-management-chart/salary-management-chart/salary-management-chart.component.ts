import { SalaryService } from 'src/app/core/services/salary.service';
import { ShareDataService } from '../../../services/share-data.service';
import { Chart } from 'chart.js';
import { Component, OnInit } from '@angular/core';
import { topItemTrigger } from 'src/app/shared/animations/payment/payment.animation';
import { LoginService } from '@app/services/login.service';

@Component({
  selector: 'app-salary-chart',
  templateUrl: './salary-management-chart.component.html',
  styleUrls: ['./salary-management-chart.component.css'],
  animations: [topItemTrigger]
})

export class SalaryManagementChartComponent implements OnInit {
  public chartInComeData: Chart;
  public allInComeData: any[];
  public monthArray: string[] = [];
  public salaryArray: number[] = [];

  constructor(private shareDataService: ShareDataService, private loginService: LoginService, private salaryService: SalaryService) { }

  ngOnInit() {
    this.onLoadComponent();
  }
  onLoadComponent() {
    const username = this.loginService.getUsernameAndId().username;
    this.salaryService.get(username).subscribe(response => {
      this.shareDataService.changeSalary(response.message.salaryByMonth);
    });
    this.waitingForChartData();
  }
  waitingForChartData() {
    this.shareDataService.currentStatusDestroySalaryCharts.subscribe(response => {
      if (response) {
        this.destroyCharts();
      }
    });
    this.shareDataService.currentSalary.subscribe(response => {
      if (response) {
        this.allInComeData = response;
        this.assignChartDataInCome();
      }
    });
  }
  assignChartDataInCome() {
    this.resetArrays();
    this.allInComeData.forEach(element => {
      this.monthArray.push(element.monthOfSalary);
      this.salaryArray.push(element.salary);
    });
    this.expensesByCurrentMonthChart('bar');
  }
  resetArrays() {
    this.monthArray = [];
    this.salaryArray = [];
  }
  expensesByCurrentMonthChart(type: string): void {
    this.chartInComeData = new Chart('chartInComeData', {
      type,
      data: {
        datasets: [{
          label: 'משכורות לפי חודשים',
          data: this.salaryArray,
          backgroundColor: ['#fbd0c6', '#f6c1a6', '#c8c87a', '#79c0b0', '#7ec2a3', '#65b6bd',
            '#70a6ca', '#90b4cb']
        },],

        labels: this.monthArray,
      },
      options: {
        scales: {
          xAxes: [{
            stacked: true,
            barThickness: 8,
            maxBarThickness: 10
          }],
          yAxes: [{
            stacked: true,
            barThickness: 8,
            maxBarThickness: 10
          }]
        },
        animation: false,
      }
    });
  }
  destroyCharts() {
    this.shareDataService.changeSalaryDestroyStatus(false);
    this.chartInComeData.destroy();
    this.assignChartDataInCome();
  }
}
