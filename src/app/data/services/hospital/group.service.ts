import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import BaseService from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService extends BaseService {
  constructor(public http: HttpClient) {
    super(http, 'dashboard/group');
  }

  /**
   * delete member from group
   * @returns data in observable
   */
  deleteMember(body: { group_id: number; patients: string[]; hcps: string[] }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/member/delete`, body);
  }
}
