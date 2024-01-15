import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import BaseService from '@services/base.service';
import { StorageService } from '@shared/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class PatientService extends BaseService {
  constructor(public http: HttpClient, private storageService: StorageService) {
    super(http, 'dashboard/patient');
  }

  /**
   * Get the patient list by doctor/nurse
   * @returns data in observable
   */
  getPatientList(body: { page: number; limit: number; filter: {}; sort: {}; groups: [] }): Observable<any> {
    return this.http.post('/dashboard/patient/list', body);
  }

  /**
   * Get calendar info about diary medication/event/memo and evaluation and blood pressure
   *
   * @param body -
   */
  getCalendar(body: { patient_id: string; start_date: string }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/calendar`, body);
  }

  /**
   * Get target blood pressure for the patient
   *
   * @param body - body to send API request
   */
  setTargetBloodPressure(body: { patient_id: string; patient_sys_goal: number; patient_dia_goal: number }) {
    return this.http.post(`${this.BASE_URL}/setting-target-blood-pressure`, body);
  }

  setOfficeBloodPressure(body: {
    patient_id: string;
    vital_office_systolic: number;
    vital_office_diastolic: number;
    vital_office_pulse: number;
    vital_office_standardized: number;
    timezone_offset: number;
  }) {
    return this.http.post(`${this.BASE_URL}/vital-office/create`, body);
  }

  /**
   * Get user stat of patient
   *
   * @param body -
   */
  getUserStat(body: { patient_id: string; attributes: Array<string>; page: number; limit: number }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/user-stat`, body);
  }

  /**
   * get patient blood pressure history
   * @param body -
   */
  getHomeBloodPressureHistory(body: { patient_id: string; page: number; limit: number }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/vital-bp/list`, body);
  }

  /**
   * Get body weight history
   *
   * @param body -
   */
  getBodyWeightHistory(body: { patient_id: string; page: number; limit: number }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/body-weight-history`, body);
  }

  /**
   * get chart data
   * @param body request params, including patientId, attributes needed, start and end date
   * @returns Observable
   */
  getChartData(body: {
    patient_id: string;
    attributes: Array<string>;
    start_date: string;
    end_date: string;
  }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/user-stat/graph`, body);
  }

  /**
   * get blood pressure chart data
   * @param body request params
   * @returns observable
   */
  getBloodPressureChartData(body: {
    patient_id: string;
    start_date: string;
    end_date: string;
    timezone_offset: number;
  }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/blood-pressure/graph`, body);
  }

  /**
   * get body temperature chart data
   * @param body request params
   * @returns observable
   */
  getBodyTemperatureChartData(body: { patient_id: string; start_date: string; end_date: string }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/temperature-information/graph`, body);
  }

  /**
   * get other chart data
   * @param body request params
   * @returns observable
   */
  getOtherChartData(body: {
    patient_id: string;
    start_date: string;
    end_date: string;
    timezone_offset: number;
  }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/other-graph`, body);
  }

  /**
   * get diary chart data
   * @param body request params
   * @returns observable
   */
  getDiaryChartData(body: { patient_id: string; start_date: string; end_date: string }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/diary-event/graph`, body);
  }

  /**
   * get data for alert chart
   * @param body request params
   * @returns observable
   */
  getAlertChartData(body: { patient_id: string; start_date: string; end_date: string }) {
    return this.http.post(`${this.BASE_URL}/alert-graph`, body);
  }

  /**
   * update alert chart data
   * @param body request params
   * @returns observable
   */
  updateAlertChart(body: {
    patient_id: string;
    alert_diary_type: number;
    alert_diary_ldate: string;
    alert_diary_is_confirmed: number;
    alert_diary_memo: string;
  }) {
    return this.http.post(`${this.BASE_URL}/alert-graph/update`, body);
  }

  /**
   * Confirm medical examination time by doctor
   *
   * @param body -
   */
  confirmMedicalExaminationTime(body: { patient_id: string; timezone_offset: number }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/status-confirm`, body);
  }

  /**
   * Get vital office history
   *
   * @param body -
   */
  getVitalOfficeHistory(body: { patient_id: string; page: number; limit: number }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/vital-office/list`, body);
  }

  /**
   * Get latest data
   *
   * @param body -
   */
  getLatestData(body: { patient_id: string }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/stat/update`, body);
  }

  /**
   * delete day medical register
   * @returns data in observable
   */
  deleteMedicalRegister(body: { medical_register_id: number }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/medical-register/delete`, body);
  }

  /**
   * create day medical register
   * @param body
   * @returns
   */
  confirmMedicalRegister(body: { patient_id: string; timezone_offset: number }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/medical-register/create`, body);
  }

  /**
   * Get temperature history
   *
   * @param body -
   */
  getTemperatureHistory(body: { patient_id: string; page: number; limit: number }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/body-temperature-history`, body);
  }

  /**
   * Get ranking history of patient
   *
   * @param body -
   */
  getRankingHistory(body: { patient_id: string; page: number; limit: number }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/ranking-history`, body);
  }

  /**
   * Get heart beat history of patient
   *
   * @param body -
   */
  getHeartBeatHistory(body: { patient_id: string; page: number; limit: number }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/vital-hb/list`, body);
  }

  /**
   * get data for heart heat chart
   * @param body request params, including patientId, start and end date
   * @returns Observable
   */
  getHeartBeatChartData(body: {
    patient_id: string;
    start_date: string;
    end_date: string;
    timezone_offset: number;
  }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/stat/heart-beat`, body);
  }

  /**
   * Get alert setting of patient
   *
   * @param body -
   */
  getAlertSetting(body: { patient_id: string }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/setting-alert/detail`, body);
  }

  /**
   * set alert setting of patient
   *
   * @param body -
   */
  setAlertSetting(body: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/separate-alert/setting`, body);
  }

  /**
   * get alert list
   *
   * @param body -
   */
  getAlertList(body: { page: number; limit: number; filter: {}; sort: {} }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/alert/list`, body);
  }

  /**
   *get alert detail
   * @param body
   * @returns
   */
  getDetailAlert(body: { patient_id: string }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/alert/detail`, body);
  }

  /**
   * delete detail alert
   * @param body
   * @returns
   */
  deleteDetailAlert(body: {
    patient_id: string;
    alert_memo: string;
    list_alert_new_id: Array<number>;
  }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/alert/delete`, body);
  }

  /**
   * confirm detail alert
   * @param body
   * @returns
   */
  confirmDetailAlert(body: {
    patient_id: string;
    alert_memo: string;
    list_alert_new_id: Array<number>;
  }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/alert/archive`, body);
  }

  /**
   * get list alert cancel
   */
  getListAlertCancel(body: { patient_id: string; page: number; limit: number }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/alert-cancel/list`, body);
  }

  /**
   * get body weight chart data
   * @param body request params
   * @returns observable
   */
  getBodyWeightChartData(body: {
    patient_id: string;
    start_date: string;
    end_date: string;
    timezone_offset: number;
  }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/weight/graph`, body);
  }

  /**
   * get estimated NYHA + review heart failure chart data
   * @param body request params
   * @returns observable
   */
  getEstimatedNYHAData(body: { patient_id: string; start_date: string; end_date: string }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/review`, body);
  }

  /**
   * get BP drug chart data
   * @param body request params
   * @returns observable
   */
  getBPDrugChartData(body: { patient_id: string; start_date: string; end_date: string }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/blood-pressure-drug/graph`, body);
  }

  /**
   * get list prescription data
   * @param body request params
   * @returns observable
   */
  getListPrescription(body: { patient_id: string; start_date: string; end_date: string }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/medicine-plan`, body);
  }

  /**
   * get template mail from database
   * @returns template mail
   */
  getMailTemplate(body: {
    hospital_email_template_language: string;
    hospital_email_template_type?: number;
  }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/mail-template`, body);
  }

  /**
   * set time invoke mail to database
   * @returns
   */
  setTimeInvokeMailer(body: { patient_id: string; patient_email_status: number }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/save-invoke-mailer-time`, body);
  }

  /**
   * get report data from local storage
   * @returns
   */
  getReportData(): any {
    return this.storageService.getFromLocal('dataExport');
  }

  /**
   * Download patient BP reportt
   */
  exportPatientBloodPressureReport(body: { patient_id: string; end_date: string; timezone_offset: number }) {
    return this.http.post(`${this.BASE_URL}/export-pdf`, body, { responseType: 'text' });
  }

  /**
   * Download patient BP reportt
   */
  downloadReportBP(body: { patient_report_id: string }) {
    return this.http.post(`${this.BASE_URL}/report-download-pdf`, body, { responseType: 'text' });
  }

  /**
   * get message history
   */
  getMessageHistory(body: { patient_id: string; language: string; last_message_id: number }) {
    return this.http.post(`${this.BASE_URL}/messages`, body);
  }

  /**
   * get patient badge notification count
   */
  getPatientBadgeNotification(body: any) {
    return this.http.post(`${this.BASE_URL}/badge`, body);
  }

  /**
   * shinden analysis download
   */
  shindenAnalysisDownload(body: { patient_id: string; vital_heart_beat_id: string }) {
    return this.http.post(`${this.BASE_URL}/vital-hb/download`, body, { responseType: 'text', observe: 'response' });
  }

  /**
   * get all drug list of hospital
   */
  getAllDrug(body: any) {
    return this.http.post(`${this.BASE_URL}/medicine/list`, body);
  }

  /**
   * get detail prescription
   */
  getDetailPrescription(body: { patient_id: string }) {
    return this.http.post(`${this.BASE_URL}/medicine-plan/detail`, body);
  }

  /**
   * save prescription
   */
  savePrescription(body: { patient_id: string; data: Array<any> }) {
    return this.http.post(`${this.BASE_URL}/medicine-plan/save`, body);
  }

  /**
   * download Patient list csv
   */
  downloadPatientListCSV(body: {
    group_id: number;
    export_type: number;
    start_date?: string;
    end_date?: string;
    timezone_offset: number;
    language: string;
    limit?: number;
  }) {
    return this.http.post(`${this.BASE_URL}/list/download`, body, { responseType: 'text', observe: 'response' });
  }

  /**
   * download Patient detail csv
   */
  downloadPatientDetailCSV(body: {
    patient_id: string;
    export_type: number;
    start_date?: string;
    end_date?: string;
    timezone_offset: number;
    language: string;
    limit?: number;
  }) {
    return this.http.post(`${this.BASE_URL}/detail/download`, body, { responseType: 'text', observe: 'response' });
  }

  /**
   * sync personal info of patient from b2b
   */
  syncPatientProfile(body: { patient_id: string }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/sync-profile`, body);
  }
}
