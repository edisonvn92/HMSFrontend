import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import BaseService from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class HcpService extends BaseService {
  constructor(public http: HttpClient) {
    super(http, 'dashboard/hcp');
  }
}
