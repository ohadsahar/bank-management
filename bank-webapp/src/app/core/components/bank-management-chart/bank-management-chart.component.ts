import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ShareDataService } from 'src/app/core/services/share-data.service';
import * as fromRoot from '../../../app.reducer';
import * as chartActions from '../../../store/actions/chart.actions';
import { ChartByCardName } from './../../../shared/models/chart-by-cardname.model';
import { ChartDivision } from './../../../shared/models/chart-division.model';
import { LoginService } from './../../services/login.service';
import { MessageService } from './../../services/message.service';
@Component({
  selector: 'app-bank-management-chart',
  templateUrl: './bank-management-chart.component.html',
  styleUrls: ['./bank-management-chart.component.css'],
})

export class BankManagementChartComponent implements OnInit {

  public chartTransactions: ChartByCardName[];
  public chartDivisions: ChartDivision[];
  public arrayCardsNames: string[] = [];
  public arrayCardsTotalPrice: number[] = [];
  public arrayExpansesEachMonth: number[] = [];
  public arrayEachMonthData: string[] = [];
  public arrayEachMonthDivision: number[] = [];
  public arrayDivisionNames: string[] = [];
  public chartByMonthTransactions: any[];
  public chartDataToSubscribe: Subscription;
  public allCardChart: Chart;
  public allExpensesByMonthChart: Chart;
  public eachMonthExpenses: Chart;
  public divisionChart: Chart;
  public currentMonth: string;
  isLoading: boolean;
  private getCharts$: Subject<void> = new Subject<void>();
  constructor(private loginService: LoginService, private store: Store<fromRoot.State>, private shareDataService: ShareDataService,
              private spinnerService: Ng4LoadingSpinnerService, private messageService: MessageService) {
    this.isLoading = false;
    this.currentMonth = moment().format('MMMM');
  }
  ngOnInit() {
    this.getAllCharts();
    this.waitingForDataCharts();
  }
  getAllCharts(): void {
    this.loading();
    this.store.dispatch(new chartActions.GetCharts(this.loginService.getUsernameAndId().username));
    this.chartDataToSubscribe = this.store.select(fromRoot.getChartsData).pipe(takeUntil(this.getCharts$))
      .subscribe((data) => {
        if (data.loaded && this.chartDataToSubscribe) {
          this.chartTransactions = data.data.chartGroupByCardName;
          this.chartByMonthTransactions = data.data.chartGroupByMonth;
          this.chartDivisions = data.data.chartGroupByDivision;
          this.assignDataToCharts();
        }
      }, (error) => {
        this.messageService.failedMessage(error, 'Dismiss');
        this.loaded();
      });
  }
  waitingForDataCharts() {
    this.shareDataService.currentTransactions.subscribe(transactions => {
      this.chartTransactions = transactions;
      this.shareDataService.currentStatusOfDestroy.subscribe(response => {
        if (response) {
          this.destroyCharts();
        }
      });
    });
  }
  assignDataToCharts(): void {
    this.resetCharts();
    this.chartTransactions.forEach(transactionData => {
      this.arrayCardsNames.push(transactionData.cardName);
      this.arrayCardsTotalPrice.push((transactionData.price as any).toFixed(0));
    });

    this.chartByMonthTransactions.forEach(element => {
      this.arrayExpansesEachMonth.push(element.monthPurchase);
      this.arrayEachMonthData.push(Number(element.eachMonth).toFixed(0));
    });

    this.chartDivisions.forEach(element => {
      this.arrayDivisionNames.push(element.typeProduct);
      this.arrayEachMonthDivision.push((element.price as any).toFixed(0));
    });
    this.chartDataToSubscribe.unsubscribe();
    this.loadCharts();
    this.loaded();
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
        legend: {
          labels: {
            fontColor: 'white',
            fontSize: 14,
            fontFamily: '\'Varela Round\', \'sans-serif\'',
          }
        },
        animation: false,
      }
    });
  }
  eachMonthChartDisplay(type: string): void {
    this.eachMonthExpenses = new Chart('eachMonthExpenses', {
      type,
      data: {
        datasets: [{
          label: 'חודשים',
          data: this.arrayEachMonthData,
          backgroundColor: ['#fbd0c6', '#f6c1a6', '#c8c87a', '#79c0b0', '#7ec2a3', '#65b6bd',
            '#70a6ca', '#90b4cb']
        },],

        labels: this.arrayExpansesEachMonth,
      },
      options: {
        legend: {
          labels: {
            fontColor: 'white',
            fontSize: 18,
            fontFamily: '\'Varela Round\', \'sans-serif\'',
          }
        },
        scales: {
          yAxes: [{
            stacked: true,
            barThickness: 8,
            maxBarThickness: 10,
          }],
          xAxes: [{
            stacked: true,
            barThickness: 8,
            maxBarThickness: 10,
            ticks: {
              fontColor: 'white',
              fontSize: 18,
              stepSize: 1,
              beginAtZero: true
            }
          }],
        },
        animation: false,
      }
    });
  }
  divisionChartDisplay(type: string): void {
    this.allCardChart = new Chart('divisionChart', {
      type,
      data: {
        labels: this.arrayDivisionNames,
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
            '#5F4842',
            '#CBBAED',
            '#19381F',
            '#E9DF00',
            '#000300',
            '#2E282A',
            '#1C3144',
            '#EFE9F4',

          ],
          borderColor: 'black',
          data: this.arrayEachMonthDivision
        }]
      },
      options: {
        animation: false,
        legend: {
          labels: {
            fontColor: 'white',
            fontSize: 14,
            fontFamily: '\'Varela Round\', \'sans-serif\'',
          }
        },
      },

    });

  }
  loadCharts(): void {
    this.cardsChart('pie');
    this.eachMonthChartDisplay('bar');
    this.divisionChartDisplay('doughnut');
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
    this.shareDataService.changeDestroy(false);
    this.getAllCharts();
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
