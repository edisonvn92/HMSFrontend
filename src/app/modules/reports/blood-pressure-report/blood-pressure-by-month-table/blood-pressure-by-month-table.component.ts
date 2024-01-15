import { Component, Input, OnChanges } from '@angular/core';
import { IHospitalThresholdBp } from '@data/models/hospitalThresholdBp';
import { TranslateService } from '@ngx-translate/core';
import { calculateAverageFromData, fixNumber, formatDatetime, getReportBPIconTarget } from '@shared/helpers';
import { BloodPressureThreshold, defaultPatientLanguage } from '@shared/helpers/data';
import moment from 'moment';
import { BloodPressureByMonthChart } from '../charts/blood-pressure-by-month-chart';
import { WeightByMonthChart } from '../charts/weight-by-month-chart';
import setting from '@data/json/hospitalSetting.json';

@Component({
  selector: 'app-blood-pressure-by-month-table',
  templateUrl: './blood-pressure-by-month-table.component.html',
  styleUrls: ['./blood-pressure-by-month-table.component.scss'],
})
export class BloodPressureByMonthTableComponent implements OnChanges {
  @Input() inputData: any = {};
  @Input() endDate: string = moment().format();
  @Input() startDate: string = moment(this.endDate).subtract(5, 'months').startOf('month').format();
  @Input() patientId: string = '';
  @Input() page = 3;
  @Input() totalPage = 4;
  @Input() outputDateTime: string = '';
  @Input() hospitalSetting: any = {};
  @Input() patientSysGoal: number = setting.default_hospital_setting_bp.sys_goal;
  @Input() patientDiaGoal: number = setting.default_hospital_setting_bp.dia_goal;
  @Input() bpThreshold: IHospitalThresholdBp = {
    hospital_threshold_bp_black_dia: BloodPressureThreshold.diff_dia_2,
    hospital_threshold_bp_black_sys: BloodPressureThreshold.diff_sys_2,
    hospital_threshold_bp_dark_red_dia: BloodPressureThreshold.diff_dia_1,
    hospital_threshold_bp_dark_red_sys: BloodPressureThreshold.diff_sys_1,
  };
  @Input() language: string = defaultPatientLanguage;

  data6Month: any[] = [];
  bloodPressureByMonthChart: BloodPressureByMonthChart | any;
  weightByMonthChart: WeightByMonthChart | any;
  propertyArray: any = {};
  average: any = {
    monthYear: 'average',
  };

  constructor(public translate: TranslateService) {}

  ngOnChanges(): void {
    let date = this.startDate;
    do {
      let currentData: any = {
        monthYear: moment(date).format('YYYY-MM'),
      };
      Object.keys(this.inputData).forEach((key) => {
        (this.inputData[key] as any[]).forEach((data: any) => {
          let currentMonthYear = data.patient_stat_month_year
            ? data.patient_stat_month_year
            : data.user_stat_month_year;
          if (currentData.monthYear == currentMonthYear) {
            Object.keys(data).forEach((prop) => {
              if (!prop.includes('month')) {
                currentData[prop] = prop.includes('weight')
                  ? Number(fixNumber(Number(data[prop]), 1))
                  : Number(fixNumber(Number(data[prop]), 0));
                if (!this.propertyArray[prop]) this.propertyArray[prop] = [];
                (this.propertyArray[prop] as number[]).push(currentData[prop]);
              }
            });
          }
        });
      });
      this.data6Month.push(currentData);
      date = moment(date).add(1, 'month').format();
    } while (moment(date).isSameOrBefore(moment(this.endDate)));
    Object.keys(this.propertyArray).forEach((key) => {
      this.average[key] = calculateAverageFromData(this.data6Month, key);
    });
    this.bloodPressureByMonthChart = new BloodPressureByMonthChart(
      'monthChartDiv',
      this.data6Month,
      this.average,
      this.patientSysGoal,
      this.patientDiaGoal,
      this.bpThreshold,
      this.translate,
      this.language
    );
    this.weightByMonthChart = new WeightByMonthChart('weightChartDiv', this.data6Month, this.average);
  }

  /**
   * return data text
   * @param data data
   * @param field field string
   * @returns formatted text
   */
  getDataText(data: any, field: string) {
    return data[field] ? (field.includes('weight') ? fixNumber(data[field], 1) : fixNumber(data[field], 0)) : '---';
  }

  /**
   * return date text format
   * @param dateString datestring
   * @param formatType type format
   * @returns date text
   */
  getTimeFormat(dateString: any, formatType: string = 'YYYY/MM/DD') {
    return formatDatetime(dateString, formatType);
  }

  /**
   * get icon target
   * @param sysValue : sys value to calculate
   * @return path img icon
   */
  getSysIconTarget(sysValue: number | string) {
    return getReportBPIconTarget(
      sysValue,
      this.patientSysGoal,
      this.bpThreshold.hospital_threshold_bp_black_sys,
      this.bpThreshold.hospital_threshold_bp_dark_red_sys
    ).icon;
  }

  /**
   * get dia icon target
   * @param diaValue : dia value to calculate
   * @return path img icon
   */
  getDiaIconTarget(diaValue: number) {
    return getReportBPIconTarget(
      diaValue,
      this.patientDiaGoal,
      this.bpThreshold.hospital_threshold_bp_black_dia,
      this.bpThreshold.hospital_threshold_bp_dark_red_dia
    ).icon;
  }
}
