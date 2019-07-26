import { Store } from '@ngrx/store';
import { LoginService } from './../../../services/login.service';
import { ChartByCardName } from './../../../../shared/models/chart-by-cardname.model';
import { Component, OnInit } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { Chart } from 'chart.js';
import * as chartActions from '../../../../store/actions/chart.actions';
import * as fromRoot from '../../../../app.reducer';
import { takeUntil } from 'rxjs/operators';
import { bottomSideItemTrigger } from 'src/app/shared/animations/bank-management/bank-management-animations.animations';

@Component({
  selector: 'app-bank-management-chart',
  templateUrl: './bank-management-chart.component.html',
  styleUrls: ['./bank-management-chart.component.css'],
  animations: [bottomSideItemTrigger]
})

export class BankManagementChartComponent implements OnInit {

  constructor(private loginService: LoginService, private store: Store<fromRoot.State>) { }
  public chartTransactions: ChartByCardName[];
  public arrayCardsNames: string[] = [];
  public arrayCardsTotalPrice: number[] = [];
  public arrayExpansesEachMonth: number[] = [];
  public arrayEachMonthData: string[] = [];
  public chartByMonthTransactions: any[];
  public chartDataToSubscribe: Subscription;
  public allCardChart: Chart;
  public allExpensesByMonthChart: Chart;
  public eachMonthExpenses: Chart;
  private getCharts$: Subject<void> = new Subject<void>();

  ngOnInit() {
    this.getAllCharts();
  }
  getAllCharts(): void {
    this.store.dispatch(new chartActions.GetCharts(this.loginService.getUsernameAndId().username));
    this.chartDataToSubscribe = this.store.select(fromRoot.getChartsData).pipe(takeUntil(this.getCharts$))
      .subscribe((data) => {
        if (data.loaded && this.chartDataToSubscribe) {
          this.chartTransactions = data.data.chartGroupByCardName;
          this.chartByMonthTransactions = data.data.chartGroupByMonth;
          this.assignDataToCharts();
        }
      });
  }
  assignDataToCharts(): void {
    this.resetCharts();
    this.chartTransactions.forEach(transactionData => {
      this.arrayCardsNames.push(transactionData.cardName);
      this.arrayCardsTotalPrice.push(transactionData.price);
    });
    this.chartByMonthTransactions.forEach(element => {
      this.arrayExpansesEachMonth.push(element.monthPurchase);
      this.arrayEachMonthData.push(element.price);
    });
    this.chartDataToSubscribe.unsubscribe();
    this.loadCharts();
  }
  cardsChart(type: string): void {
    this.allCardChart = new Chart('allCardChart', {
      type,
      data: {
        labels: this.arrayCardsNames,
        datasets: [{
          backgroundColor: [
            '#ff6361',
            '#bc5090',
            'blue',
            'orange',
            'purple',
            'red',
            'yellow',
            'lightblue',
            '#5F4842'
          ],
          borderColor: 'black',
          data: this.arrayCardsTotalPrice
        }]
      },
      options: {
        animation: false,
      }
    });
  }
  eachMonthChartDisplay(type: string): void {
    this.eachMonthExpenses = new Chart('eachMonthExpenses', {
      type,
      data: {
        datasets: [{
          label: 'לפי חודשים',
          data: this.arrayEachMonthData,
          backgroundColor: ['#fbd0c6', '#f6c1a6', '#c8c87a', '#79c0b0', '#7ec2a3', '#65b6bd',
            '#70a6ca', '#90b4cb']
        },],

        labels: this.arrayExpansesEachMonth,
      },
      options: {
        scales: {
          xAxes: [{
            stacked: true,
            barThickness: 8,
            maxBarThickness: 10,

          }],
          yAxes: [{
            stacked: true,
            barThickness: 8,
            maxBarThickness: 10,

          }]
        },
        animation: false,
      }
    });
  }
  loadCharts(): void {
    this.cardsChart('pie');
    this.eachMonthChartDisplay('bar');
  }
  resetCharts(): void {
    this.arrayCardsTotalPrice = [];
    this.arrayCardsNames = [];
    this.arrayExpansesEachMonth = [];
    this.arrayEachMonthData = [];
  }
  destroyCharts(): void {
    this.allCardChart.destroy();
    this.eachMonthExpenses.destroy();
    this.getAllCharts();
  }
}
