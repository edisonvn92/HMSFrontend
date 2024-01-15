import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import Validators from '@shared/validators/base.validator';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { sex } from '@shared/helpers/data';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { RegistrationService } from '@data/services/registration/registration.service';
import { environment } from '@env/environment';
import { ToastService } from '@shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '@shared/services/storage.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent implements OnInit {
  @ViewChild('sexDropdown', { static: false, read: NgbDropdown }) ngbSexDropdown!: NgbDropdown;
  @Output() confirmClicked: EventEmitter<any> = new EventEmitter();

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
  public minDate = new Date('1-1-1900');
  public isError = false;
  public sex = JSON.parse(JSON.stringify(sex));
  public isRegistrationScreen = false;
  public maxDate = new Date();
  public patientForm = this.formBuilder.group({
    patient_omron_connect_id: '',
    patient_code: '',
    patient_full_name: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'submit',
      },
    ],
    patient_birthday: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'submit',
      },
    ],
    patient_gender: sex.MALE,
    patient_email: '',
    patient_phone: [
      '',
      {
        updateOn: 'submit',
      },
    ],
    isAgreePolicy: false,
    access_token: '',
  });

  constructor(
    private formBuilder: FormBuilder,
    public sharedService: SharedService,
    private registrationService: RegistrationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private translate: TranslateService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    let code = this.route.snapshot.queryParams['code'];
    this.isRegistrationScreen = false;
    if (this.storageService.getFromLocal('isWebView')) {
      this.router.navigate(['/patient-app/auth'], {
        queryParams: { type: 'login-success', code: code },
      });
    } else if (this.storageService.getFromLocal('isShindenAdvice')) {
      this.router.navigate(['/shinden-registration/shinden-advice/form'], {
        queryParams: { code: code, hospital_code: this.registrationService.getCurrentHospital().hospital_code },
      });
    } else {
      this.isRegistrationScreen = true;
      if (code !== this.storageService.getFromSession('omronCode')) {
        this.registrationService.omronConnect({ code }).subscribe(
          (result: any) => {
            this.storageService.setToSession('omronAccessToken', result.access_token);
            this.storageService.setToSession('omronCode', code);
            this.patientForm.patchValue({
              access_token: result.access_token,
            });
            this.getOmronProfile(result.access_token);
          },
          (error) => {
            this.sharedService.showLoadingEventEmitter.emit(false);
            let errMessage = error.error.message
              ? this.translate.instant(`error.${error.error.message}`)
              : this.translate.instant('error.server');
            this.toastService.show(errMessage, { className: 'bg-red-100' });
            this.router.navigate(['/registration-site/top'], {
              queryParams: { hospital_code: this.registrationService.getCurrentHospital().hospital_code },
            });
            throw error;
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
  }

  /**
   * Get omron profile using access token
   * @param accessToken access token of patient
   */
  getOmronProfile(accessToken: string) {
    this.registrationService.getB2BUserProfile(accessToken).subscribe(
      (data: any) => {
        this.patientForm.patchValue({
          patient_omron_connect_id: data.returnedValue.userID,
          patient_email: data.returnedValue.emailAddress,
          patient_phone: data.returnedValue.phoneNumber || null,
          patient_gender:
            data.returnedValue.key_user_s_gender === null || data.returnedValue.key_user_s_gender === undefined
              ? sex.MALE
              : data.returnedValue.key_user_s_gender,
          patient_birthday: this.getReturnedBirthday(data.returnedValue.key_user_s_birthday),
        });
        this.sharedService.showLoadingEventEmitter.emit(false);
      },
      (error: any) => {
        throw error;
      }
    );
  }

  /**
   * transform datestring sent from b2b to date
   * @param dateString date string
   * @returns date
   */
  getReturnedBirthday(dateString: string | null) {
    if (dateString) {
      const day = Number(dateString.substring(6, 8));
      const month = Number(dateString.substring(4, 6));
      const year = Number(dateString.substring(0, 4));
      if (day && month && year) return new Date(year, month - 1, day);
      else return this.defaultBirthday;
    }
    return this.defaultBirthday;
  }

  /**
   * Handles the event when the reset button is clicked.
   */
  public selectedItem(value: any) {
    this.patientForm.patchValue({
      patient_gender: value,
    });
    this.ngbSexDropdown.toggle();
  }

  /**
   * Handle event when user  input date
   */
  public onDateChange(dateInput: any) {
    const date = moment(dateInput).format('yyyy-MM-DD');

    this.patientForm.patchValue({
      patient_birthday: date,
    });
  }

  /**
   * Handle event when confirm button is clicked
   */
  public onConfirmClicked() {
    setTimeout(() => {
      this.isError = this.patientForm.invalid;
      if (!this.isError) {
        this.patientForm.patchValue({
          patient_full_name: this.patientForm.get('patient_full_name')!.value.replace(/[\s,]+/gu, ' '),
        });
        this.confirmClicked.emit(this.patientForm.value);
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
