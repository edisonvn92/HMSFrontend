import { Component, Input, OnInit } from '@angular/core';
import { getDayOfWeek } from '@shared/helpers';
import { defaultPatientLanguage, ECGDataResult, heartSubjectiveSymptoms, report } from '@shared/helpers/data';
import { RecordByDayOfWeekChart } from '../../charts/record-by-day-of-week-chart';
import { RecordBySymptomChart } from '../../charts/record-by-symptoms-chart';
import { RecordIn12MonthsChart } from '../../charts/record-in-12-months-chart';

@Component({
  selector: 'app-ecg-trend-analysis',
  templateUrl: './ecg-trend-analysis.component.html',
  styleUrls: ['./ecg-trend-analysis.component.scss'],
})
export class EcgTrendAnalysisComponent implements OnInit {
  @Input() data12Month: any[] = [];
  @Input() dataByDay: any[] = [];
  @Input() dataBySymptom: any[] = [];
  @Input() language: string = defaultPatientLanguage;
  @Input() textCodeChart2: string = '';
  @Input() endDate: Date = new Date();

  maxSymptom: number = 0;
  maxSymptomShown = {
    count: 0,
    name: '',
    afib_count: 0,
  };
  textCode2: number = 12;
  maxCountDay: number = 0;
  trendByDayOfWeekChart: RecordByDayOfWeekChart | any;
  trendBySymptomChart: RecordBySymptomChart | any;
  trendIn12MonthChart: RecordIn12MonthsChart | any;

  constructor() {}

  ngOnInit(): void {
    let arr = this.textCodeChart2.split('_');
    this.textCode2 = Number(arr[0]);
    if (arr.length > 1) this.maxCountDay = Number(arr[1]);
    this.findMaxSymptom();
    this.trendByDayOfWeekChart = new RecordByDayOfWeekChart('trendByDayOfWeek', this.dataByDay, this.language);
    this.trendBySymptomChart = new RecordBySymptomChart('trendBySymptom', this.dataBySymptom, this.language);
    this.trendIn12MonthChart = new RecordIn12MonthsChart(
      'trendIn12Month',
      this.data12Month,
      this.endDate,
      this.language
    );
  }

  /**
   * find max count symptom from data
   */
  findMaxSymptom() {
    this.dataBySymptom.forEach((data) => {
      if (data.vital_heart_beat_count && data.vital_heart_beat_symptom !== heartSubjectiveSymptoms.NONE) {
        let total = (Object.values(data.vital_heart_beat_count) as number[]).reduce((a: number, b: number) => a + b);
        let symptomText = Object.keys(heartSubjectiveSymptoms).find(
          (key) => heartSubjectiveSymptoms[key] == data.vital_heart_beat_symptom
        );
        if (total > this.maxSymptom) {
          if (symptomText) {
            this.maxSymptom = total;
            this.maxSymptomShown = {
              count: total,
              name: report[this.language]['symptom'][(symptomText as string).toLowerCase()].toLowerCase(),
              afib_count: data.vital_heart_beat_count[ECGDataResult.AFIB_POSSIBLE],
            };
          }
        } else if (total === this.maxSymptom) {
          this.maxSymptomShown.count += total;
          this.maxSymptomShown.name += `, ${report[this.language]['symptom'][
            (symptomText as string).toLowerCase()
          ].toLowerCase()}`;
          this.maxSymptomShown.afib_count += data.vital_heart_beat_count[ECGDataResult.AFIB_POSSIBLE];
        }
      }
    });
  }

  /**
   * Get day of week follow day index
   * @param dayOfWeek
   */
  getDayOfWeek(dayOfWeek: number): string {
    return getDayOfWeek(dayOfWeek);
  }
}
