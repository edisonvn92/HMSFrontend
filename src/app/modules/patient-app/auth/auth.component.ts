import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientAppService } from '@data/services/webview/patient-app.service';
import { environment } from '@env/environment';
import { StorageService } from '@shared/services/storage.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  private type!: string | null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private patientAppService: PatientAppService
  ) {}

  ngOnInit(): void {
    this.type = this.activatedRoute.snapshot.queryParamMap.get('type');
    this.storageService.setToLocal('isWebView', true);
    this.storageService.removeFromLocal('isShindenAdvice');

    if (this.type === 'login') {
      window.location.href = `${environment.omron_connect_registration_link}/${environment.omron_connect_group_id}/integration/webauth/connect?id=openidconnect.simple&result_url=${environment.frontend_url}/registration-site/registration`;
    }
    if (this.type === 'login-success') {
      this.login(this.activatedRoute.snapshot.queryParamMap.get('code') || '');
    }
  }

  /**
   * get token from HMS and post data to app
   * @param code ogsc code
   */
  login(code: string) {
    appChannel.postMessage(JSON.stringify({ data: { isShowLoading: true }, type: 'loading' }));
    this.patientAppService.login({ ogsc_auth_code: code }).subscribe(
      (data: any) => {
        appChannel.postMessage(JSON.stringify({ status: 'success', data: data, type: 'login' }));
        appChannel.postMessage(JSON.stringify({ data: { isShowLoading: false }, type: 'loading' }));
      },
      (err) => {
        appChannel.postMessage(JSON.stringify({ status: 'failed', data: err.error, type: 'login' }));
        appChannel.postMessage(JSON.stringify({ data: { isShowLoading: false }, type: 'loading' }));
      }
    );
  }
}
