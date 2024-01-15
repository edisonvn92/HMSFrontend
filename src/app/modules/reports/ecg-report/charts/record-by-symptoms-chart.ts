import { ECGDataResult, heartSubjectiveSymptoms, report } from '@shared/helpers/data';
import { ECGRecordTrendBaseChart } from './ecg-record-trend-base-chart';

export class RecordBySymptomChart extends ECGRecordTrendBaseChart {
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
    let symptomList = [
      heartSubjectiveSymptoms.CHEST_PAIN,
      heartSubjectiveSymptoms.DIZZY,
      heartSubjectiveSymptoms.MALAISE,
      heartSubjectiveSymptoms.NAUSEA,
      heartSubjectiveSymptoms.PALPITATIONS,
      heartSubjectiveSymptoms.SHORTNESS_OF_BREATH,
      heartSubjectiveSymptoms.OTHERS,
      heartSubjectiveSymptoms.NONE,
    ];
    symptomList.forEach((symptomCode: any) => {
      let modifiedData: any = {
        symptom: '',
        normal: 0,
        danger: 0,
        abnormal: 0,
        unclassified: 0,
      };
      let symptomText = Object.keys(heartSubjectiveSymptoms).find((key) => heartSubjectiveSymptoms[key] == symptomCode);
      modifiedData.symptom = report[this.language]['symptom'][(symptomText as string).toLowerCase()];

      let data = (this.data as any[]).find((data) => data.vital_heart_beat_symptom === symptomCode);
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
    this.dateAxis.dataFields.category = 'symptom';
    let label = this.dateAxis.renderer.labels.template;
    label.lineHeight = 1;
    if (this.language == 'ja') {
      label.wrap = true;
      label.maxWidth = 10;
    } else {
      label.wrap = true;
      label.maxWidth = 80;
    }
  }

  createYAxis() {
    super.createYAxis();
    this.yAxis.renderer.minGridDistance = 20;
  }

  createColumn(length: string, fillColor: string): any {
    let series = super.createColumn(length, fillColor);
    series.dataFields.categoryX = 'symptom';
  }
}
