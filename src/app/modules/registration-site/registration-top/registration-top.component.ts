import { Component } from '@angular/core';
import { RegistrationService } from '@data/services/registration/registration.service';
import { environment } from '@env/environment';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '@shared/services/storage.service';
@Component({
  selector: 'app-registration-top',
  templateUrl: './registration-top.component.html',
  styleUrls: ['./registration-top.component.scss'],
})
export class RegistrationTopComponent {
  constructor(
    private registrationService: RegistrationService,
    public sharedService: SharedService,
    private toastService: ToastService,
    private translate: TranslateService,
    private storageService: StorageService
  ) {}

  get hospital() {
    return this.registrationService.getCurrentHospital();
  }

  /**
   * Handle event when register button is clicked
   */
  onRegisterClicked() {
    this.storageService.removeFromLocal('isWebView');
    this.storageService.removeFromLocal('isShindenAdvice');
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
