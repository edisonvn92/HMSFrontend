import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import BaseService from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class DataSyncTimeService extends BaseService {
  constructor(public http: HttpClient) {
    super(http, 'dashboard/b2b');
  }

  /**
   * Get Latest b2b Data Sync Time
   * @returns
   */
  getLatestDataSync(): Observable<any> {
    return this.http.post(`${this.BASE_URL}/latest-data-sync-time`, {});
  }
}
