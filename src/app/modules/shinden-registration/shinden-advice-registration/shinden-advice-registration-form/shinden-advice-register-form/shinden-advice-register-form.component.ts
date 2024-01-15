import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationService } from '@data/services/registration/registration.service';
import { environment } from '@env/environment';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { getDayFromB2BData, getDiffDate, joinName } from '@shared/helpers';
import { sex } from '@shared/helpers/data';
import { SharedService } from '@shared/services/shared.service';
import { StorageService } from '@shared/services/storage.service';
import { ToastService } from '@shared/services/toast.service';
import moment from 'moment';

@Component({
  selector: 'app-shinden-advice-register-form',
  templateUrl: './shinden-advice-register-form.component.html',
  styleUrls: ['./shinden-advice-register-form.component.scss'],
})
export class ShindenAdviceRegisterFormComponent implements OnInit {
  @ViewChild('sexDropdown', { static: false, read: NgbDropdown }) ngbSexDropdown!: NgbDropdown;
  @Output() nextClicked: EventEmitter<any> = new EventEmitter();

  public isError = false;
  public defaultBirthday = '1960-01-01';
  public genders = [
    {
      text: 'Male',
      value: sex.MALE,
    },
    {
      text: 'Female',
      value: sex.FEMALE,
    },
  ];
  public minDate = new Date('1900-01-01');
  public maxDate = new Date();
  public sex = JSON.parse(JSON.stringify(sex));
  public hospital: any = this.registrationService.getCurrentHospital();
  public patientForm = this.formBuilder.group({
    ogsc_user_id: '',
    full_name: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'submit',
      },
    ],
    birthday: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'submit',
      },
    ],
    gender: sex.MALE,
    email: '',
    emailVerified: false,
    ogsc_access_token: '',
    timezone_offset: new Date().getTimezoneOffset(),
  });

  constructor(
    public sharedService: SharedService,
    private registrationService: RegistrationService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private toastService: ToastService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    let code = this.route.snapshot.queryParams['code'];
    if (code !== this.storageService.getFromSession('omronCode')) {
      this.registrationService.omronConnect({ code }).subscribe(
        (result: any) => {
          this.storageService.setToSession('omronAccessToken', result.access_token);
          this.storageService.setToSession('omronCode', code);
          this.patientForm.patchValue({
            ogsc_access_token: result.access_token,
          });
          this.getOmronProfile(result.access_token);
        },
        (error: any) => {
          let errMessage = error.error.message
            ? this.translate.instant(`error.${error.error.message}`)
            : this.translate.instant('error.server');
          this.toastService.show(errMessage, { className: 'bg-red-100' });
          this.sharedService.showLoadingEventEmitter.emit(false);
          this.router.navigate(['/shinden-registration/shinden-advice/top'], {
            queryParams: { hospital_code: this.hospital.hospital_code },
          });
        }
      );
    } else {
      const accessToken = this.storageService.getFromSession('omronAccessToken');
      this.patientForm.patchValue({
        ogsc_access_token: accessToken,
      });
      this.getOmronProfile(accessToken);
    }
  }

  /**
   * Get omron profile using access token
   * @param accessToken access token of patient
   */
  getOmronProfile(accessToken: string) {
    this.registrationService.getOmronProfile(this.hospital.hospital_id, accessToken).subscribe(
      (data: any) => {
        if (data.patient && data.patient.deleted_at) {
          let errMessage = this.translate.instant("wrong infomation, please contact the hospital's admin");
          this.toastService.show(errMessage, { className: 'bg-red-100' });
          this.sharedService.showLoadingEventEmitter.emit(false);
          this.router.navigate(['/shinden-registration/shinden-advice/top'], {
            queryParams: { hospital_code: this.hospital.hospital_code },
          });
        }
        if (
          data.patient &&
          ((data.patient.patient_start_period_of_use &&
            getDiffDate(new Date(), data.patient.patient_start_period_of_use) > 0) ||
            (data.patient.patient_end_period_of_use &&
              getDiffDate(new Date(), data.patient.patient_end_period_of_use) < 0))
        ) {
          let errMessage = this.translate.instant('error.patient account expired');
          this.toastService.show(errMessage, { className: 'bg-red-100' });
          this.sharedService.showLoadingEventEmitter.emit(false);
          this.router.navigate(['/shinden-registration/shinden-advice/top'], {
            queryParams: { hospital_code: this.hospital.hospital_code },
          });
        }
        let b2bBirthday = this.getBirthDayFromB2BData(data.profile.key_user_s_birthday);
        this.patientForm.patchValue({
          ogsc_user_id: data.profile.userID,
          full_name: data.patient
            ? joinName(
                data.patient.patient_first_name,
                data.patient.patient_middle_name,
                data.patient.patient_last_name
              )
            : '',
          email: data.patient && data.patient.patient_email ? data.patient.patient_email : data.profile.emailAddress,
          emailVerified: data.profile.emailAddressVerified,
          gender:
            data.patient && ![null, undefined].includes(data.patient.patient_gender)
              ? data.patient.patient_gender
              : [null, undefined].includes(data.profile.key_user_s_gender)
              ? sex.MALE
              : data.profile.key_user_s_gender,
          birthday:
            data.patient && data.patient.patient_birthday
              ? data.patient.patient_birthday
              : b2bBirthday
              ? moment(b2bBirthday).format('yyyy-MM-DD')
              : this.defaultBirthday,
        });
        this.sharedService.showLoadingEventEmitter.emit(false);
      },
      (error: any) => {
        let errMessage = error.error.message
          ? this.translate.instant(`error.${error.error.message}`)
          : this.translate.instant('error.server');
        this.toastService.show(errMessage, { className: 'bg-red-100' });
        this.sharedService.showLoadingEventEmitter.emit(false);
        this.router.navigate(['/shinden-registration/shinden-advice/top'], {
          queryParams: { hospital_code: this.hospital.hospital_code },
        });
      }
    );
  }

  /**
   * Handles the event when the reset button is clicked.
   */
  public selectedItem(value: any) {
    this.patientForm.patchValue({
      gender: value,
    });
    this.ngbSexDropdown.toggle();
  }

  /**
   * Handle event when user  input date
   */
  public onDateChange(dateInput: any) {
    const date = moment(dateInput).format('yyyy-MM-DD');

    this.patientForm.patchValue({
      birthday: date,
    });
  }

  /**
   * transform datestring sent from b2b to date
   * @param dateString date string
   * @returns date
   */
  getBirthDayFromB2BData(dateString: string) {
    return getDayFromB2BData(dateString);
  }

  /**
   * Handle event when confirm button is clicked
   */
  public onNextClicked() {
    setTimeout(() => {
      this.isError = this.patientForm.invalid;
      if (!this.isError) {
        this.patientForm.patchValue({
          full_name: this.patientForm.get('full_name')!.value.replace(/[\s,]+/gu, ' '),
        });
        this.nextClicked.emit(this.patientForm.value);
      }
    }, 0);
  }

  /**
   * Handle event when cancel button is clicked
   */
  public onCancelClicked() {
    window.location.href = `${environment.omron_connect_registration_link}/${environment.omron_connect_group_id}/integration/webauth/connect?id=openidconnect.simple&result_url=${environment.frontend_url}/registration-site/registration`;
  }
}
