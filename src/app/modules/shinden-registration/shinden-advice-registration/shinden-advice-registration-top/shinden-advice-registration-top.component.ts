import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '@data/services/registration/registration.service';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '@shared/services/shared.service';
import { StorageService } from '@shared/services/storage.service';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-shinden-advice-registration-top',
  templateUrl: './shinden-advice-registration-top.component.html',
  styleUrls: ['./shinden-advice-registration-top.component.scss'],
})
export class ShindenAdviceRegistrationTopComponent implements OnInit {
  constructor(
    private registrationService: RegistrationService,
    public sharedService: SharedService,
    private toastService: ToastService,
    private translate: TranslateService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {}

  get hospital() {
    return this.registrationService.getCurrentHospital();
  }

  onAgreeClicked() {
    this.storageService.removeFromLocal('isWebView');
    this.storageService.setToLocal('isShindenAdvice', true);
    if (
      !environment.omron_connect_registration_link ||
      !environment.omron_connect_group_id ||
      !environment.omron_connect_app_id
    ) {
      this.toastService.show(this.translate.instant('patient registration web is off'), { className: 'bg-red-100' });
    } else {
      window.location.href = `${environment.omron_connect_registration_link}/${environment.omron_connect_group_id}/integration/webauth/connect?id=openidconnect.simple&result_url=${environment.frontend_url}/registration-site/registration`;
    }
  }
}
