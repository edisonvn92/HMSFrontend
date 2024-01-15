import { Component, OnInit } from '@angular/core';
import { PatientService } from '@data/services/doctor/patient.service';
import moment from 'moment';
import hospitalSetting from '@data/json/hospitalSetting.json';
import { TranslateService } from '@ngx-translate/core';
import { BloodPressureThreshold, defaultPatientLanguage, report } from '@shared/helpers/data';
import setting from '@data/json/hospitalSetting.json';

@Component({
  selector: 'app-blood-pressure-report',
  templateUrl: './blood-pressure-report.component.html',
  styleUrls: ['./blood-pressure-report.component.scss'],
})
export class BloodPressureReportComponent implements OnInit {
  public formatType = 'YYYY-MM-DD';
  endDate: string = moment().format(this.formatType);
  endDateChart: string | Date = '';
  startDate: string = moment(this.endDate).subtract(30, 'days').format(this.formatType);
  midDate = '';
  midDate2 = '';
  start6Month: string = moment(this.endDate).subtract(5, 'months').startOf('month').format();
  reportData: any;
  dailyData1: any[] = [];
  dailyData2: any[] = [];
  dataIn6Months: any = {};
  patientStatDayOfWeek: any[] = [];
  patientId: string = '';
  outputDateTime: string = moment().format();
  timezone_offset: number = 0;
  hospitalSetting: any = hospitalSetting.default_hospital_setting_time;
  totalPage = 3;
  language: string = defaultPatientLanguage;
  supportedLanguage = Object.keys(report);
  patientSysGoal: number = setting.default_hospital_setting_bp.sys_goal;
  patientDiaGoal: number = setting.default_hospital_setting_bp.dia_goal;
  bpThreshold: any = {
    hospital_threshold_bp_black_dia: BloodPressureThreshold.diff_dia_2,
    hospital_threshold_bp_black_sys: BloodPressureThreshold.diff_sys_2,
    hospital_threshold_bp_dark_red_dia: BloodPressureThreshold.diff_dia_1,
    hospital_threshold_bp_dark_red_sys: BloodPressureThreshold.diff_sys_1,
  };
  constructor(private patientService: PatientService, public translate: TranslateService) {}

  ngOnInit(): void {
    // get data from local storage
    this.reportData = this.patientService.getReportData();
    if (this.reportData) {
      if (this.reportData.patient) {
        this.patientId = this.reportData.patient.patient_code;
        if (this.reportData.patient.patient_sys_goal) this.patientSysGoal = this.reportData.patient.patient_sys_goal;
        if (this.reportData.patient.patient_dia_goal) this.patientDiaGoal = this.reportData.patient.patient_dia_goal;
        if (
          this.reportData.patient.user &&
          this.reportData.patient.user.user_language &&
          this.supportedLanguage.includes(this.reportData.patient.user.user_language)
        )
          this.language = this.reportData.patient.user.user_language;
      }
      if (this.reportData.timezone_offset) this.timezone_offset = this.reportData.timezone_offset;
      if (this.reportData.export_page) this.totalPage = this.reportData.export_page;
      if (this.reportData.export_datetime) {
        this.outputDateTime = moment(this.reportData.export_datetime)
          .subtract(this.timezone_offset, 'minutes')
          .format();
      } else {
        this.outputDateTime = moment().subtract(this.timezone_offset, 'minutes').format();
      }
      if (this.reportData.hospitalSetting) {
        this.hospitalSetting = this.reportData.hospitalSetting;
      }
      if (this.reportData.hospitalThresholdBp) {
        Object.keys(this.bpThreshold).forEach((key: string) => {
          if (this.reportData.hospitalThresholdBp[key])
            this.bpThreshold[key] = this.reportData.hospitalThresholdBp[key];
        });
      }
      if (this.reportData.endDate) {
        this.endDate = moment(this.reportData.endDate).format(this.formatType);
      }
      if (this.reportData.start1Month) {
        this.startDate = moment(this.reportData.start1Month).format(this.formatType);
      }
      if (this.reportData.start6Month) {
        this.start6Month = moment(this.reportData.start6Month).format(this.formatType);
      }
    }
    this.translate.use(this.language);
    this.midDate = moment(this.startDate).add(15, 'days').format(this.formatType);
    this.midDate2 = moment(this.startDate).add(16, 'days').format(this.formatType);
    this.endDateChart = moment(this.midDate2).add(15, 'days').format(this.formatType);
    // get data for 2 page of the report
    if (this.reportData && this.reportData.data1Month) {
      this.formatData1Month(this.dailyData1, this.startDate, this.midDate);
      this.formatData1Month(this.dailyData2, this.midDate2, this.endDate);
      this.patientStatDayOfWeek = this.reportData.data1Month.patientStatDayOfWeek;
      this.dataIn6Months = this.reportData.data6Month;
    }
  }

  /**
   * set up data for 1 page of daily report
   * @param array array to send to component
   * @param startDate start date of the page
   * @param endDate end date of the page
   */
  private formatData1Month(array: any[], startDate: string, endDate: string) {
    let data1Month = this.reportData.data1Month;
    let date = startDate;
    while (moment(date).isBefore(moment(endDate).add(1, 'days'))) {
      let data: any = {
        date: date,
      };
      Object.keys(data1Month).forEach((keys: string) => {
        let element: any = (data1Month[keys] as any[]).find((data: any) => {
          if (data.patient_stat_ldate) return data.patient_stat_ldate === date;
          else if (data.user_stat_ldate) return data.user_stat_ldate === date;
          else if (data.patient_diary_ldate) return data.patient_diary_ldate === date;
          else return data.vital_bp_ldate === date;
        });
        if (element) {
          if (keys === 'vitalBpEvening') {
            data['evening_time'] = element.vital_bp_time;
          } else if (keys === 'vitalBpMorning') {
            data['morning_time'] = element.vital_bp_time;
          } else {
            Object.keys(element).forEach((value: string) => {
              data[value] = element[value];
            });
          }
        }
      });
      array.push(data);
      date = moment(date).add(1, 'days').format(this.formatType);
    }
  }
}
