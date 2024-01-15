import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import BaseService from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class ThresholdBPService extends BaseService {
  constructor(public http: HttpClient) {
    super(http, 'dashboard/admin/threshold-bp');
  }
}
