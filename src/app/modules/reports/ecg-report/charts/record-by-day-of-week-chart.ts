import { ECGDataResult, report } from '@shared/helpers/data';
import { ECGRecordTrendBaseChart } from './ecg-record-trend-base-chart';

export class RecordByDayOfWeekChart extends ECGRecordTrendBaseChart {
  maxValue: number = 4;
  constructor(containerId: string, data: any, language: string) {
    super(containerId, data, language);
    this.loadData();
    this.createChart();
  }

  /**
   * modify data for the chart
   * @returns modified data
   */
  loadData() {
    let modifiedList: any[] = [];
    let dayList = [2, 3, 4, 5, 6, 7, 1];
    dayList.forEach((day: number) => {
      let modifiedData: any = {
        dayOfWeek: '',
        normal: 0,
        danger: 0,
        abnormal: 0,
        unclassified: 0,
      };
      modifiedData.dayOfWeek = report[this.language]['day_of_week'][this.getDayOfWeek(day)];
      let data = (this.data as any[]).find((data) => data.vital_heart_beat_day === day);
      let total = 0;
      if (data && data.vital_heart_beat_count) {
        Object.keys(data.vital_heart_beat_count).forEach((key) => {
          total += data.vital_heart_beat_count[key];
          if (key == ECGDataResult.NORMAL) {
            modifiedData.normal = data.vital_heart_beat_count[key];
          }
          if (key == ECGDataResult.TACHYCARDIA || key == ECGDataResult.BRADYCARDIA) {
            modifiedData.abnormal += data.vital_heart_beat_count[key];
          }
          if (key == ECGDataResult.AFIB_POSSIBLE) {
            modifiedData.danger = data.vital_heart_beat_count[key];
          }
          if (key == ECGDataResult.UNCLASSIFIED) {
            modifiedData.unclassified = data.vital_heart_beat_count[key];
          }
        });
      }
      if (total > this.maxValue) this.maxValue = total;
      modifiedList.push(modifiedData);
    });
    return modifiedList;
  }

  createChart() {
    super.createChart();
  }

  createDateAxis() {
    super.createDateAxis();
    this.dateAxis.height = 75;
    this.dateAxis.dataFields.category = 'dayOfWeek';
  }

  createYAxis() {
    super.createYAxis();
    this.yAxis.renderer.minGridDistance = 20;
  }

  createColumn(length: string, fillColor: string): any {
    let series = super.createColumn(length, fillColor);
    series.dataFields.categoryX = 'dayOfWeek';
  }
}
