import { Injectable } from '@angular/core';
import BaseService from '@services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HospitalService extends BaseService {
  constructor(public http: HttpClient) {
    super(http, 'dashboard/hospital');
  }

  /**
   * get hospital setting
   * @param body - body
   */
  getHospitalSetting(body: { tables: Array<string> }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/setting`, body);
  }
}
