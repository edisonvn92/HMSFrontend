import { AfterViewInit, Component, Input } from '@angular/core';
import { IHospitalThresholdBp } from '@data/models/hospitalThresholdBp';
import { TranslateService } from '@ngx-translate/core';
import {
  calculateAverageFromData,
  fixNumber,
  formatDatetime,
  getReportBPIconTarget,
  getWeekday,
} from '@shared/helpers';
import { BloodPressureThreshold, defaultPatientLanguage } from '@shared/helpers/data';
import moment from 'moment';
import { BloodPressureByDayChart } from '../charts/blood-pressure-by-day-chart';
import { needShowEventList, maxIcon } from '@modules/reports/blood-pressure-report/data';
import setting from '@data/json/hospitalSetting.json';

@Component({
  selector: 'app-blood-pressure-by-day-table',
  templateUrl: './blood-pressure-by-day-table.component.html',
  styleUrls: ['./blood-pressure-by-day-table.component.scss'],
})
export class BloodPressureByDayTableComponent implements AfterViewInit {
  @Input() dailyData: any[] = [];
  @Input() startDate: string | Date = moment().format();
  @Input() endDate: string | Date = moment().format();
  @Input() endDateChart: string | Date = moment().format();
  @Input() chartDivName: string = '';
  @Input() patientId: string = '';
  @Input() page: number = 2;
  @Input() totalPage: number = 4;
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

  public averageData: any = {};
  propertyArray = [
    'patient_stat_sys_morning',
    'patient_stat_dia_morning',
    'patient_stat_pulse_morning',
    'patient_stat_sys_evening',
    'patient_stat_dia_evening',
    'patient_stat_pulse_evening',
    'user_stat_weight',
  ];
  dateArray: any[] = [];
  bloodPressureByDayChart: BloodPressureByDayChart | any;
  moment = moment;

  constructor(public translate: TranslateService) {}

  ngAfterViewInit(): void {
    while (this.dailyData.length < 16) {
      this.dailyData.push({});
    }
    this.bloodPressureByDayChart = new BloodPressureByDayChart(
      this.chartDivName,
      this.startDate,
      this.endDateChart,
      this.dailyData,
      this.patientSysGoal,
      this.patientDiaGoal,
      this.bpThreshold,
      this.translate,
      this.language
    );

    this.getActionMemo();

    this.propertyArray.forEach((property) => {
      this.averageData[property] = calculateAverageFromData(this.dailyData, property);
    });
  }

  /**
   * set action icons for each day
   */
  getActionMemo() {
    this.dailyData.forEach((data) => {
      data.eventClassList = [];
      if (data.patient_diary_event && data.patient_diary_event.length > 0) {
        // sort asc event
        data.patient_diary_event.sort((a: number, b: number) => {
          return a - b;
        });

        needShowEventList.forEach((event: any) => {
          if (data.patient_diary_event.includes(event.value) && data.eventClassList.length < maxIcon) {
            data.eventClassList.push(event.icon);
          }
        });
      }
    });
  }

  /**
   * return day of week text
   * @param dateString datestring
   * @returns day of week text
   */
  getDayOfWeekText(dateString: string) {
    return getWeekday(dateString);
  }

  /**
   * return date text
   * @param dateString datestring
   * @returns date text
   */
  getDateText(dateString: string) {
    if (!dateString) return '';
    return moment(dateString).date() === 1 ? `${moment(dateString).month() + 1}/1` : moment(dateString).date();
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
   * return memo text
   * @param memo string
   * @returns memo text
   */
  getMemoText(memo: string) {
    if (memo) {
      const maxLength = 50;
      return memo.length <= maxLength ? memo : `${memo.substring(0, maxLength - 1)}...`;
    }
    return '';
  }

  /**
   * return hour text
   * @param text text input
   * @returns hour text
   */
  getHourText(text: string) {
    return text ? text.substring(0, 5) : '--:--';
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
