import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export default abstract class BaseService {
  public readonly BASE_URL = `/${this.path}`;

  protected constructor(protected http: HttpClient, protected path?: string) {}

  /**
   * Get the list data
   * @returns data in observable
   */
  findMany(body: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/list`, body);
  }

  /**
   * Get the  item
   * @returns  An Observable of the HttpResponse for the request.
   */
  find(body: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/detail`, body);
  }

  /**
   * create item
   * @returns An Observable of the HttpResponse for the request.
   */
  create(body: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/create`, body);
  }

  /**
   * update item
   * @returns data in observable
   */
  update(body: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/update`, body);
  }

  /**
   * delete item
   * @returns  An Observable of the HttpResponse for the request.
   */
  delete(body: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/delete`, body);
  }
}
