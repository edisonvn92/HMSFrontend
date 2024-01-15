import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { getWeekday } from '@shared/helpers';
import {
  defaultPatientLanguage,
  ECGDataResult,
  exerciseIntensity,
  heartSubjectiveSymptoms,
} from '@shared/helpers/data';
import moment from 'moment';
import { vitalHeartBeatShindenSymptomList } from '../data';

@Component({
  selector: 'app-ecg-record-list-page',
  templateUrl: './ecg-record-list-page.component.html',
  styleUrls: ['./ecg-record-list-page.component.scss'],
})
export class EcgRecordListPageComponent implements OnInit {
  @Input() recordList: any[] = [];
  @Input() totalPage = 2;
  @Input() pageNumber = 2;
  @Input() patient = {};
  @Input() language = defaultPatientLanguage;
  @Input() recordDate: Date = new Date();
  @Input() endDate: Date = new Date();

  ecgResultConstant = ECGDataResult;
  heartSubjectiveSymptoms = heartSubjectiveSymptoms;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.getSymptomIconList();
  }

  /**
   * return day of week text
   * @param dateString datestring
   * @returns day of week text
   */
  getDateText(dateString: string = '') {
    return `${moment(dateString).date()} (${this.translate.instant(
      getWeekday(dateString) ? getWeekday(dateString) : '-'
    )})`;
  }

  /**
   * get hour text from datestring
   * @param dateString date string
   * @returns hour text
   */
  getHourText(dateString: string) {
    return moment(dateString).format('hh:mm A');
  }

  /**
   * get record result text from result type
   * @param resultType result type
   * @returns result text
   */
  getResultText(resultType: number) {
    switch (resultType) {
      case ECGDataResult.NORMAL:
        return this.language === 'en' ? 'normal' : 'normal sinus rhythm';
      case ECGDataResult.TACHYCARDIA:
        return 'tachycardia';
      case ECGDataResult.BRADYCARDIA:
        return 'bradycardia';
      case ECGDataResult.AFIB_POSSIBLE:
        return 'afib possible';
      case ECGDataResult.UNCLASSIFIED:
        return 'unclassified';
      default:
        return '-';
    }
  }

  /**
   * return memo text
   * @param memo string
   * @returns memo text
   */
  getMemoText(memo: string) {
    if (memo) {
      const maxLength = 30;
      return memo.length <= maxLength ? memo : `${memo.substring(0, maxLength - 1)}...`;
    }
    return '';
  }

  /**
   * set symptom icon list for the records
   */
  getSymptomIconList() {
    this.recordList.forEach((record) => {
      // sort asc event
      record.symptomIconList = [];
      if (record.vital_heart_beat_shinden_symptom) {
        vitalHeartBeatShindenSymptomList.forEach((item: any) => {
          if (record.vital_heart_beat_shinden_symptom.includes(item.value)) {
            record.symptomIconList.push(item.icon);
          }
        });
      }
    });
  }

  /**
   * get exercise intensity text
   * @param intensityCode intensity text code
   * @returns intensity text
   */
  getIntensityText(intensityCode: any) {
    switch (intensityCode) {
      case exerciseIntensity.NOT_ENTERED:
        return 'intensity.not entered';
      case exerciseIntensity.STRONG:
        return 'intensity.strong';
      case exerciseIntensity.MEDIUM:
        return 'intensity.medium';
      case exerciseIntensity.WEAK:
        return 'intensity.weak';
      case exerciseIntensity.REST:
        return 'intensity.rest';
      default:
        return '-';
    }
  }
}
