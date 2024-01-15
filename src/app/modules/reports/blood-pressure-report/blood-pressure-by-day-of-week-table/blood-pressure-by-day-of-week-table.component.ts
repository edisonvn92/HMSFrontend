import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { BloodPressureByDayOfWeekChart } from '@modules/reports/blood-pressure-report/charts/blood-pressure-by-day-of-week-chart';
import { formatDatetime } from '@shared/helpers';
import { defaultPatientLanguage } from '@shared/helpers/data';
import setting from '@data/json/hospitalSetting.json';

@Component({
  selector: 'app-blood-pressure-by-day-of-week-table',
  templateUrl: './blood-pressure-by-day-of-week-table.component.html',
  styleUrls: ['./blood-pressure-by-day-of-week-table.component.scss'],
})
export class BloodPressureByDayOfWeekTableComponent implements OnChanges {
  @Input() chartData: any[] = [];
  @Input() startDate: string | Date = moment().format();
  @Input() endDate: string | Date = moment().format();
  @Input() chartDivName: string = '';
  @Input() patientId: string = '';
  @Input() outputDateTime: string = '';
  @Input() page = 4;
  @Input() totalPage = 4;
  @Input() hospitalSetting: any = {};
  @Input() patientSysGoal: number = setting.default_hospital_setting_bp.sys_goal;
  @Input() patientDiaGoal: number = setting.default_hospital_setting_bp.dia_goal;
  @Input() language: string = defaultPatientLanguage;

  dateArray: any[] = [];
  bloodPressureByMonthChart: BloodPressureByDayOfWeekChart | any;

  constructor(private translate: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.chartData) {
      this.bloodPressureByMonthChart = new BloodPressureByDayOfWeekChart(
        this.chartDivName,
        this.startDate,
        this.endDate,
        this.chartData,
        this.patientSysGoal,
        this.patientDiaGoal,
        this.translate,
        this.language
      );
    }
  }

  getDateText(dateString: string) {
    if (moment(dateString).date() === 1) {
      return `${moment(dateString).month() + 1}/1`;
    } else return moment(dateString).date();
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
}
