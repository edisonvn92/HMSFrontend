import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PatientService } from '@data/services/doctor/patient.service';
import { NgbActiveModal, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import Validators from '@shared/validators/base.validator';
import { handleName, joinName } from '@shared/helpers';
import { language, sex } from '@shared/helpers/data';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import BaseValidators from '@shared/validators/base.validator';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss'],
})
export class PatientProfileComponent implements OnInit, OnDestroy {
  @ViewChild('langDropdown', { static: false, read: NgbDropdown }) ngbLangDropdown!: NgbDropdown;

  public minDate = new Date('1-1-1900');
  public maxDate = new Date();
  public patientId = '';
  public sex = sex;
  public isError = false;
  public validationErr: string = '';
  public error = { patient_birthday: { required: 0 }, patient_gender: { required: 0 } };
  public emailVerified: any;
  public email = '';
  public language = language;
  public patientForm = this.formBuilder.group({
    patient_id: '',
    patient_code: [
      '',
      {
        validators: [Validators.required, Validators.pattern('^[A-Za-z0-9._-]{0,50}$')],
        updateOn: 'submit',
      },
    ],
    patient_first_name: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'submit',
      },
    ],
    patient_middle_name: '',
    patient_last_name: '',
    patient_full_name: '',
    patient_birthday: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'submit',
      },
    ],
    patient_gender: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'submit',
      },
    ],
    patient_email: '',
    user: this.formBuilder.group({
      user_language: '',
    }),
    patient_phone: [
      '',
      {
        validators: [Validators.minLength(7), BaseValidators.checkFormattedMobile, Validators.maxLength(16)],
        updateOn: 'submit',
      },
    ],
  });
  public subscriptions: Subscription = new Subscription();
  public allowSyncPatient = false;

  constructor(
    private formBuilder: FormBuilder,
    public sharedService: SharedService,
    private patientService: PatientService,
    private activeModal: NgbActiveModal,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.patientForm.controls.patient_id.setValue(this.patientId);
    this.patientService.find({ patient_id: this.patientId }).subscribe(
      (data) => {
        if (data) {
          this.patientForm.patchValue({
            ...data,
            user: { user_language: data.user_language },
            patient_full_name: joinName(data.patient_first_name, data.patient_middle_name, data.patient_last_name),
          });
          this.emailVerified = data.user_email_verified;
          this.email = data.patient_email;
          if (!this.patientForm.controls.user.value.user_language) {
            this.patientForm.patchValue({ user: { user_language: language.JAPANESE } });
          }
        }
        this.sharedService.showLoadingEventEmitter.emit();
      },
      () => {
        this.sharedService.showLoadingEventEmitter.emit(false);
      }
    );
  }

  ngOnDestroy() {
    this.sharedService.showLoadingEventEmitter.emit(false);
    this.subscriptions.unsubscribe();
  }

  /**
   * handle when create button is clicked
   */
  handleName(data: any): void {
    const name = handleName(data.trim());
    this.patientForm.patchValue({
      patient_first_name: name[0],
      patient_middle_name: name[1],
      patient_last_name: name[2],
    });
  }

  /**
   * handle when language is selected
   */
  handleSelectLanguage(language: string): void {
    this.patientForm.patchValue({ user: { user_language: language } });
    this.ngbLangDropdown.close();
  }

  /**
   *
   * @returns handle when submit button is clicked
   */
  submitClicked(): void {
    setTimeout(() => {
      this.handleName(this.patientForm.controls.patient_full_name.value);
      this.isError = this.patientForm.invalid;
      this.error.patient_birthday.required = this.patientForm.controls.patient_birthday.errors?.required;
      this.error.patient_gender.required = this.patientForm.controls.patient_gender.errors?.required;
      this.validationErr = '';
      if (!this.isError) {
        let param = this.patientForm.value;
        delete param.patient_email;
        this.subscriptions.add(
          this.patientService.update(param).subscribe(
            () => {
              this.activeModal.close();
              this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
            },
            (error) => {
              if (error.error.errorCode) {
                this.isError = true;
                this.validationErr = error.error.message;
              }
            }
          )
        );
      }
    }, 0);
  }

  /**
   * Handle event when user  input date
   */
  public onDateChange(dateInput: any) {
    const date = moment(dateInput).format('yyyy-MM-DD');
    this.patientForm.patchValue({ patient_birthday: date });
  }

  /**
   * handle when close button is clicked
   */
  clickedClose(): void {
    this.activeModal.dismiss('Notify click');
  }

  /**
   * handle when clicking update gender and birthday
   */
  syncPatientProfile() {
    this.patientService.syncPatientProfile({ patient_id: this.patientId }).subscribe(
      (data) => {
        if (data.patient_gender !== undefined) this.patientForm.patchValue({ patient_gender: data.patient_gender });
        if (data.patient_birthday) this.patientForm.patchValue({ patient_birthday: data.patient_birthday });
        this.sharedService.showLoadingEventEmitter.emit(false);
      },
      (error) => {
        this.toastService.show(this.translate.instant(`errMsg.${error.error.message}`), { className: 'bg-red-100' });
        this.sharedService.showLoadingEventEmitter.emit(false);
      }
    );
  }
}
