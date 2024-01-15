import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import BaseService from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  constructor(public http: HttpClient) {
    super(http, 'dashboard/user');
  }

  /**
   * add member to group
   * @returns data in observable
   */
  addUser(body: { groups: number[]; hcps: number[]; patients: number[] }) {
    return this.http.post(`${this.BASE_URL}/add-group`, body);
  }
}
