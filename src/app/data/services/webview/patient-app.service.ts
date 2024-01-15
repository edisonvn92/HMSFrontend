import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class PatientAppService {
  private appHttp: HttpClient;

  constructor(public http: HttpClient, handler: HttpBackend) {
    this.appHttp = new HttpClient(handler);
  }

  /**
   * get token from HMS
   * @param body ogsc_auth_code
   */
  login(body: { ogsc_auth_code: string }) {
    return this.appHttp.post(`${environment.api_url}/app/patient/auth/login`, body);
  }

  /**
   *get chart data
   */
  getChartData(body: any, accessToken: string) {
    return this.appHttp.post(`${environment.api_url}/app/patient/blood-pressure-and-medication/graph`, body, {
      headers: new HttpHeaders({
        Authorization: `${accessToken}`,
      }),
    });
  }
}
