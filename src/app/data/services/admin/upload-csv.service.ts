import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import BaseService from '../base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadCsvService extends BaseService {
  constructor(public http: HttpClient) {
    super(http, 'admin');
  }

  /**
   * upload csv from group
   * @returns data in observable
   */
  uploadCSV(body: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/import-user-csv`, body);
  }

  /**
   * get Import Status
   * @returns data in observable
   */
  getImportStatus(): Observable<any> {
    return this.http.post(`${this.BASE_URL}/import-status`, {});
  }
}
