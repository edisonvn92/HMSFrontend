import { Component, Input, OnInit } from '@angular/core';
import { defaultPatientLanguage } from '@shared/helpers/data';
import moment from 'moment';

@Component({
  selector: 'app-ecg-summary-page',
  templateUrl: './ecg-summary-page.component.html',
  styleUrls: ['./ecg-summary-page.component.scss'],
})
export class EcgSummaryPageComponent implements OnInit {
  @Input() totalPage = 2;
  @Input() patient: any = {};
  @Input() data12Month: any[] = [];
  @Input() dataByDay: any[] = [];
  @Input() dataBySymptom: any[] = [];
  @Input() data1Month: any[] = [];
  @Input() language: string = defaultPatientLanguage;
  @Input() recordDate: Date = new Date();
  @Input() textCodeChart2: string = '';
  @Input() endDate: Date = new Date();

  currentMonth: string = '';
  previousMonth: string = '';
  dataThisMonth: any[] = [];
  dataPreviousMonth: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.currentMonth = moment(this.endDate).format('YYYY-MM');
    let dayOfPreviousMonth = moment(this.endDate).startOf('month').subtract(1, 'd');
    this.previousMonth = dayOfPreviousMonth.format('YYYY-MM');
    if (this.data12Month) {
      this.dataThisMonth = this.data12Month.find((data) => {
        return data.vital_heart_beat_month == this.currentMonth;
      });
      this.dataPreviousMonth = this.data12Month.find((data) => {
        return data.vital_heart_beat_month == this.previousMonth;
      });
    }
  }
}
