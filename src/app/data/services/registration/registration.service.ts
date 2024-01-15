import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IHospitalInfo } from '@data/models/hospital';
import { StorageService } from '@shared/services/storage.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import BaseService from '../base.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService extends BaseService {
  hospitalInfo: IHospitalInfo | any;
  private b2bHttp: HttpClient;
  constructor(public http: HttpClient, private storageService: StorageService, handler: HttpBackend) {
    super(http, 'register');
    this.b2bHttp = new HttpClient(handler);
  }

  /**
   * get hospital information from hospital code
   * @param hospitalCode hospital code
   * @returns Observable of hospital info
   */
  getHospitalInfo(hospitalCode: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/hospital/information`, { hospital_code: hospitalCode }).pipe(
      map((hospital: any) => {
        this.storageService.setToLocal('hospital', hospital);
        return hospital;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  /**
   * get current hospital info (to check whether the current hospital info is available)
   * @returns behavior subject of hospital info
   */
  getCurrentHospital() {
    return this.storageService.getFromLocal('hospital');
  }

  /**
   * call b2b api to get the user profile
   * @param accessToken access token given
   * @returns observable
   */
  getB2BUserProfile(accessToken: string) {
    return this.b2bHttp.post(
      `${environment.omron_connect_registration_link}/${environment.omron_connect_app_id}/server-code/versions/current/getB2BUserProfile`,
      {},
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${accessToken}`,
        }),
      }
    );
  }

  /**
   * register user to database
   * @param body data from user
   * @returns observable
   */
  registerUser(body: {
    user_temp_omron_connect_id: string;
    user_temp_ogsc_username: string;
    user_temp_first_name: string;
    user_temp_middle_name: string;
    user_temp_last_name: string;
    user_temp_email: string;
    user_temp_phone: string;
    user_temp_birthday: string;
    user_temp_gender: number;
    user_temp_hospital_id: number;
    user_temp_language: string;
    access_token: string;
  }) {
    return this.http.post(`${this.BASE_URL}/patient/create`, body);
  }

  /**
   * Omron connect
   * @returns data in observable
   */
  omronConnect(body: { code: string }): Observable<any> {
    return this.http.post('/omron/oauth2/token', body);
  }

  /**
   * get profile from both b2b and hms db
   * @param hospitalId: hospital id
   * @param accessToken: access token
   * @returns user profile
   */
  getOmronProfile(hospitalId: number, accessToken: string) {
    return this.http.post(
      '/omron/b2b/profile',
      { hospital_id: hospitalId },
      {
        headers: new HttpHeaders({
          Authorization: accessToken,
        }),
      }
    );
  }

  /**
   * register shinden advice service api
   * @param body data from user
   * @returns response
   */
  registerShinden(body: {
    ogsc_user_id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    birthday: string;
    gender: string;
    note: string;
    hospital_code: string;
    ogsc_access_token: string;
    timezone_offset: number;
  }) {
    return this.http.post(`/dashboard/shinden/register`, body);
  }

  /**
   * send verification email to the patient
   * @param body access token from user
   * @returns response
   */
  sendConfirmationEmail(body: { access_token: string }) {
    return this.http.post('/dashboard/shinden/email/resend-verification', body);
  }
}
