import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import BaseService from '@services/base.service';

@Injectable({
  providedIn: 'root',
})
export class ShindenService extends BaseService {
  constructor(public http: HttpClient) {
    super(http, 'dashboard/shinden');
  }

  /**
   * get patient shinden report download history list
   */
  getHistoryReport(body: { patient_id: string; sort: {}; page: number; limit: number }) {
    return this.http.post(`${this.BASE_URL}/report-download-history/list`, body);
  }

  /**
   * get patient shinden report list
   */
  getPatientReportList(body: { patient_id: string; timezone_offset: number }) {
    return this.http.post(`${this.BASE_URL}/vital-month`, body);
  }

  /**
   * shinden report download
   */
  shindenDownloadReport(body: { patient_report_id: string }) {
    return this.http.post(`${this.BASE_URL}/report/download`, body, { responseType: 'text' });
  }

  /**
   * shinden report download Handmade
   */
  shindenDownloadReportHandmade(body: { patient_id: string; end_date: string; timezone_offset: number }) {
    return this.http.post(`${this.BASE_URL}/export-pdf`, body, { responseType: 'text', observe: 'response' });
  }

  /**
   * get patient shinden report list
   */
  getPatientAnalysisRequestList(body: { page: number; limit: number; filter: {}; sort: {} }) {
    return this.http.post(`${this.BASE_URL}/analysis/list`, body);
  }

  /**
   * get patient shinden report list
   */
  getVitalHeartBeatList(body: { page: number; limit: number; patient_id: string; patient_analysis_id: string }) {
    return this.http.post(`${this.BASE_URL}/vital-hb/list`, body);
  }

  /**
   * get patient shinden report list
   */
  changePayment(body: { patient_id: string; patient_analysis_id: string; patient_analysis_status: number }) {
    return this.http.post(`${this.BASE_URL}/analysis/payment`, body);
  }

  /**
   * shinden send mail
   */
  shindenSendMail(body: { patient_id: string; patient_analysis_id: string; subject: string; message: string }) {
    return this.http.post(`${this.BASE_URL}/email-reply`, body);
  }
}
