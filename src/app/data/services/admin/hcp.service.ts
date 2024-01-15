import { Injectable } from '@angular/core';
import BaseService from '@services/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HcpService extends BaseService {
  constructor(public http: HttpClient) {
    super(http, 'admin/hcp');
  }
}
