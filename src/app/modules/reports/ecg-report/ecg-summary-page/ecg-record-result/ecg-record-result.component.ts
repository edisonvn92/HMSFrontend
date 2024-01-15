import { Component, Input, OnInit } from '@angular/core';
import { fixNumber } from '@shared/helpers';
import { defaultPatientLanguage, ECGDataResult } from '@shared/helpers/data';
import moment from 'moment';
import { ECGResultPieChart } from '../../charts/ecg-result-pie-chart';
import { MonthlyHeartRateChart } from '../../charts/monthly-heart-rate-chart';

@Component({
  selector: 'app-ecg-record-result',
  templateUrl: './ecg-record-result.component.html',
  styleUrls: ['./ecg-record-result.component.scss'],
})
export class EcgRecordResultComponent implements OnInit {
  @Input() dataThisMonth: any;
  @Input() dataPreviousMonth: any;
  @Input() data1Month: any[] = [];
  @Input() language: string = defaultPatientLanguage;
  @Input() endDate: Date = new Date();

  thisMonthList: any = {};
  previousMonthList: any = {};
  totalCountThisMonth: number | string = '';
  totalCountThreshold = 20;
  totalCountPreviousMonth: number | string = '';
  ecgResultChart: ECGResultPieChart | any;
  monthlyHeartRateChart: MonthlyHeartRateChart | any;
  percentageResult: any = {
    thisMonth: {},
    previousMonth: {},
  };
  ECGDataResult = ECGDataResult;
  recordMonthText: string = '';

  constructor() {}

  ngOnInit(): void {
    this.recordMonthText = moment(this.endDate).toDate().toLocaleDateString(this.language, { month: 'long' });
    if (this.dataThisMonth && this.dataThisMonth.vital_heart_beat_count) {
      this.thisMonthList = this.dataThisMonth.vital_heart_beat_count;
      this.totalCountThisMonth = this.countTotal(this.thisMonthList);
      this.ecgResultChart;
      this.percentageResult.thisMonth = this.calculatePercentage(this.thisMonthList, this.totalCountThisMonth);
    }
    if (this.dataPreviousMonth && this.dataPreviousMonth.vital_heart_beat_count) {
      this.previousMonthList = this.dataPreviousMonth.vital_heart_beat_count;
      this.totalCountPreviousMonth = this.countTotal(this.previousMonthList);
      this.percentageResult.previousMonth = this.calculatePercentage(
        this.previousMonthList,
        this.totalCountPreviousMonth
      );
    }
    this.ecgResultChart = new ECGResultPieChart(
      'pieChartDiv',
      this.thisMonthList,
      this.language,
      this.totalCountThisMonth,
      this.totalCountPreviousMonth
    );
    this.monthlyHeartRateChart = new MonthlyHeartRateChart(
      'heartRateChartDiv',
      this.data1Month,
      this.endDate,
      this.language
    );
  }

  /**
   * count total number for data
   * @param data data input
   * @returns sum of data
   */
  countTotal(data: any): number {
    if (data) {
      return (Object.values(data) as number[]).reduce((a: number, b: number) => {
        return a + b;
      });
    } else return 0;
  }

  /**
   * calculate percentage of a data group comparing to total
   * @param data data group
   * @param total total count
   * @returns percentage
   */
  calculatePercentage(data: any, total: number): any {
    let percentage: any = {};
    Object.keys(data).forEach((type) => {
      percentage[type] = Number(fixNumber((data[type] / total) * 100, 0));
    });
    return percentage;
  }
}
