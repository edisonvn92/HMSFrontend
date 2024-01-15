import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { getYearDiff, joinName } from '@shared/helpers';
import { defaultPatientLanguage } from '@shared/helpers/data';
import moment from 'moment';

@Component({
  selector: 'app-ecg-page-header',
  templateUrl: './ecg-page-header.component.html',
  styleUrls: ['./ecg-page-header.component.scss'],
})
export class EcgPageHeaderComponent implements OnChanges {
  @Input() recordDate: Date = moment().toDate();
  @Input() pageNumber = 1;
  @Input() totalPage = 2;
  @Input() patient: any = {};
  @Input() language = defaultPatientLanguage;
  @Input() endDate: Date = moment().toDate();
  patientFullName: string = '';
  recordMonthText: string = '';
  dateOption: any = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  dateLanguage: string = defaultPatientLanguage;
  patientAge: string | number = '-';
  patientGender = 1;

  constructor(private translate: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.recordMonthText = moment(this.endDate)
      .toDate()
      .toLocaleDateString(this.language, { year: 'numeric', month: 'long' });
    if (changes.patient) {
      this.patientFullName = joinName(
        this.patient.patient_first_name,
        this.patient.patient_middle_name,
        this.patient.patient_last_name
      );
      if (this.patient.patient_birthday) this.patientAge = getYearDiff(this.patient.patient_birthday, new Date(), 0);
      if (this.patient.patient_gender !== undefined) this.patientGender = this.patient.patient_gender;
    }
  }

  /**
   * create date text base on date and language
   * @param date date
   * @returns date text
   */
  getDateText(date: Date | string) {
    return moment(date).toDate().toLocaleString(this.translate.currentLang, this.dateOption);
  }

  /**
   * get day diff between two dates
   * @param startDate
   * @param endDate
   * @param type
   */
  public getYearDiff(startDate: Date | string, endDate: Date | string): number | string {
    return getYearDiff(startDate, endDate);
  }
}
