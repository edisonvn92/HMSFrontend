import { Injectable } from '@angular/core';
import BaseService from '@services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService extends BaseService {
  constructor(public http: HttpClient) {
    super(http, 'firebase/token');
  }

  /**
   * Save token send notification
   * @returns data in observable
   */
  saveToken(body: { device_id: string; device_token: string; device_type: number }): Observable<any> {
    return this.http.post('/firebase/token/save', body);
  }

  /**
   * Delete token send notification
   * @returns data in observable
   */
  deleteToken(body: { device_id: string; device_type: number }): Observable<any> {
    return this.http.post('/firebase/token/delete', body);
  }
}
