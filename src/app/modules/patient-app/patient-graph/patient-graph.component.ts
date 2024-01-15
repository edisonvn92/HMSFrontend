import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { PatientAppService } from '@data/services/webview/patient-app.service';
import { StorageService } from '@shared/services/storage.service';
import { errorCode } from '@shared/helpers/data';
import setting from '@data/json/hospitalSetting.json';

@Component({
  selector: 'app-patient-graph',
  templateUrl: './patient-graph.component.html',
  styleUrls: ['./patient-graph.component.scss'],
})
export class PatientGraphComponent implements OnInit {
  public startDate!: Date;
  public endDate!: Date;
  public period = 7;
  public chartData = {};
  public diaGoal!: number;
  public sysGoal!: number;

  timezoneOffset = new Date().getTimezoneOffset();

  constructor(private patientAppService: PatientAppService, private storageService: StorageService) {}

  ngOnInit(): void {
    this.endDate = moment().set({ hour: 23, minute: 59, seconds: 0 }).toDate();
    this.startDate = moment()
      .subtract(this.period - 1, 'd')
      .set({ hour: 0, minute: 0, seconds: 0 })
      .toDate();

    window.setToken = (arg: any) => {
      this.setToken(JSON.parse(arg.split(`'`).join('"')));
      this.getDataChart();
    };
    appChannel.postMessage(JSON.stringify({ type: 'setToken' }));
  }

  /**
   * set token to local storage
   * @param token : Object token
   */
  setToken(token: any) {
    this.storageService.setToLocal('app_id_token', token.IdToken);
    this.storageService.setToLocal('app_access_token', token.AccessToken);
    this.storageService.setToLocal('app_refresh_token', token.RefreshToken);
  }

  /**
   * handle when swipe event is emitted
   * @param event
   */
  onSwipe(event: any) {
    if (event.isSwipeLeft) {
      this.startDate = moment(this.startDate).add(this.period, 'day').toDate();
      this.endDate = moment(this.endDate).add(this.period, 'day').toDate();
    } else {
      this.startDate = moment(this.startDate).subtract(this.period, 'day').toDate();
      this.endDate = moment(this.endDate).subtract(this.period, 'day').toDate();
    }
    this.getDataChart();
  }

  /**
   * get chart data
   */
  getDataChart() {
    const token = this.storageService.getFromLocal('app_id_token');
    appChannel.postMessage(JSON.stringify({ data: { isShowLoading: true }, type: 'loading' }));
    this.patientAppService
      .getChartData(
        {
          start_date: moment(this.startDate).format('YYYY-MM-DD'),
          end_date: moment(this.endDate).format('YYYY-MM-DD'),
          timezone_offset: this.timezoneOffset,
        },
        token
      )
      .subscribe(
        (data: any) => {
          this.chartData = data.data;
          this.sysGoal = data.patient_sys_goal || setting.default_hospital_setting_bp.sys_goal;
          this.diaGoal = data.patient_dia_goal || setting.default_hospital_setting_bp.dia_goal;
          appChannel.postMessage(JSON.stringify({ data: { isShowLoading: false }, type: 'loading' }));
        },
        (error) => {
          if (error.status === errorCode.UNAUTHORIZED_CODE || error.status == errorCode.FORBIDDEN_CODE) {
            appChannel.postMessage(JSON.stringify({ status: 'tokenExpired' }));
          }
          appChannel.postMessage(JSON.stringify({ data: { isShowLoading: false }, type: 'loading' }));
        }
      );
  }
}
