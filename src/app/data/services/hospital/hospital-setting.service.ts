import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import BaseService from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class HospitalSettingService extends BaseService {
  constructor(public http: HttpClient) {
    super(http, 'dashboard/admin/hospital-setting');
  }
}
