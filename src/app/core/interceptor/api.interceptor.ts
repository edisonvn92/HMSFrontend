import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, retry } from 'rxjs/operators';

import { StorageService } from '@shared/services/storage.service';
import { environment } from '@env/environment';
import { SharedService } from '@shared/services/shared.service';
import { AuthenticationService } from '@services/authentication.service';
import { Router } from '@angular/router';
import { ToastService } from '@shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { errorStatus } from '@shared/helpers/data';
import { role } from '@shared/helpers/data';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  retryCount = 3;
  apiListNoLoading = [
    '/firebase/token/delete',
    '/firebase/token/save',
    '/dashboard/b2b/latest-data-sync-time',
    '/dashboard/patient/messages',
    '/dashboard/patient/badge',
  ];
  apiForB2B = ['/omron/b2b/profile', '/omron/oauth2/token', '/dashboard/shinden/register'];
  fullApiForB2B = this.apiForB2B.map((url: string) => environment.api_url + url);

  // private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private storageService: StorageService,
    private sharedService: SharedService,
    private authService: AuthenticationService,
    private router: Router,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // show loading when call api
    if (!this.apiListNoLoading.includes(req.url)) {
      this.sharedService.showLoadingEventEmitter.emit(true);
    }

    let authToken = '';

    if (new Date() > this.authService.getExpiringTime()) {
      this.handleRefreshToken(req, next);
    }

    // Get the auth token from the service.
    authToken = this.storageService.getFromLocal(this.storageService.ID_TOKEN_KEY) || '';

    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization if url is not toward omron/b2b
    if (!this.apiForB2B.includes(req.url)) req = this.addToken(req, authToken);
    req = this.addLanguage(req, 'en');
    req = req.clone({
      url: environment.api_url + req.url,
    });
    return next.handle(req).pipe(
      map((event: any) => {
        // Checking successful response order to hide progress loading
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (this.fullApiForB2B.includes(req.url)) return throwError(error);
        else if (error.status === errorStatus.UNAUTHORIZED_CODE || error.status == errorStatus.FORBIDDEN_CODE) {
          if (req.url.includes('refresh') || error.error.message.includes('user has expired')) {
            let currentRoles: string[] = this.authService.getCurrentUserRoles();
            this.sharedService.showLoadingEventEmitter.emit(false);
            this.authService.signout();
            if (!this.router.url.includes('login')) {
              this.router.navigate([
                currentRoles && currentRoles.includes(role.system_admin) ? '/admin/auth/login' : '/auth/login',
              ]);
              location.reload();
            }
            return throwError(error);
          } else {
            return this.handleRefreshToken(req, next);
          }
        } else if (error.status === errorStatus.BAD_REQUEST_CODE) {
          this.sharedService.showLoadingEventEmitter.emit(false);
          return throwError(error);
        } else if (error.status >= 500 && error.status < 600) {
          retry(this.retryCount);
          this.sharedService.showLoadingEventEmitter.emit(false);
          this.toastService.show(this.translate.instant('error.server'), { className: 'bg-red-100' });
          return throwError(error);
        } else {
          retry(this.retryCount);
          this.sharedService.showLoadingEventEmitter.emit(false);
          this.toastService.show(this.translate.instant('error.unknown'), { className: 'bg-red-100' });
          return throwError(error);
        }
      })
    );
  }

  /**
   * Handle response 401 error
   * @param request
   * @param next
   * @private
   */
  private handleRefreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.refreshTokenSubject.next(null);

    return from(this.authService.refreshToken()).pipe(
      switchMap((data: any) => {
        this.refreshTokenSubject.next(data.idToken.jwtToken);
        this.storageService.setToLocal(this.storageService.ACCESS_TOKEN_KEY, data.accessToken.jwtToken);
        this.storageService.setToLocal(this.storageService.ID_TOKEN_KEY, data.idToken.jwtToken);
        return next.handle(this.addToken(request, data.idToken.jwtToken));
      }),
      catchError((error) => {
        let currentRoles: string[] = this.authService.getCurrentUserRoles();
        this.authService.signout();
        this.router.navigate([
          currentRoles && currentRoles.includes(role.system_admin) ? '/admin/auth/login' : '/auth/login',
        ]);
        location.reload();
        this.sharedService.showLoadingEventEmitter.emit(false);
        return throwError(error);
      })
    );
  }

  /**
   * Add token into header
   * @param request
   * @param token
   * @private
   */
  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set('Authorization', token),
    });
  }

  private addLanguage(request: HttpRequest<any>, language: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set('Accept-Language', language),
    });
  }
}
