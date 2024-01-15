import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationService } from '@data/services/registration/registration.service';
import { TranslateService } from '@ngx-translate/core';
import { formatDatetime, handleName } from '@shared/helpers';
import { sex } from '@shared/helpers/data';
import { SharedService } from '@shared/services/shared.service';
import { StorageService } from '@shared/services/storage.service';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-registration-confirm',
  templateUrl: './registration-confirm.component.html',
  styleUrls: ['./registration-confirm.component.scss'],
})
export class RegistrationConfirmComponent {
  @Input() patient: any;
  @Output() backClicked: EventEmitter<any> = new EventEmitter();

  public sex = JSON.parse(JSON.stringify(sex));

  constructor(
    private router: Router,
    public sharedService: SharedService,
    private registrationService: RegistrationService,
    private toastService: ToastService,
    private translate: TranslateService,
    private storageService: StorageService
  ) {}

  /**
   * Handle event when register button is clicked
   */
  onRegisterClicked() {
    const hospital = this.registrationService.getCurrentHospital();
    const name = handleName(this.patient.patient_full_name.trim());
    const bodyParams: any = {
      user_temp_omron_connect_id: this.patient.patient_omron_connect_id,
      user_temp_ogsc_username: this.patient.patient_code,
      user_temp_first_name: name[0],
      user_temp_email: this.patient.patient_email,
      user_temp_phone: this.patient.patient_phone,
      user_temp_birthday: formatDatetime(this.patient.patient_birthday),
      user_temp_gender: this.patient.patient_gender,
      user_temp_hospital_id: hospital.hospital_id,
      user_temp_language: this.translate.getBrowserLang(),
      access_token: this.patient.access_token,
    };
    if (name[1] !== '') bodyParams.user_temp_middle_name = name[1];
    if (name[2] !== '') bodyParams.user_temp_last_name = name[2];
    this.registrationService.registerUser(bodyParams).subscribe(
      () => {
        this.storageService.removeFromSession('omronCode');
        this.storageService.removeFromSession('omronAccessToken');
        this.router.navigate(['registration-site/complete']);
        this.sharedService.showLoadingEventEmitter.emit(false);
      },
      (error) => {
        this.sharedService.showLoadingEventEmitter.emit(false);
        if (error.error.message.includes('registered'))
          this.toastService.show(this.translate.instant('error.User has been registered'), { className: 'bg-red-100' });
        else this.toastService.show(this.translate.instant('error.server'), { className: 'bg-red-100' });
        this.router.navigate(['/registration-site/top'], { queryParams: { hospital_code: hospital.hospital_code } });
        throw error;
      }
    );
  }
}
