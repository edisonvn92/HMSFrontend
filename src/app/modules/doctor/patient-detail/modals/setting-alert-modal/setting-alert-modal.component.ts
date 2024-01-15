import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { PatientService } from '@data/services/doctor/patient.service';
import { bloodPressureLevel, settingAlertValidator } from '@shared/helpers/data';
import { joinName } from '@shared/helpers';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-setting-alert-modal',
  templateUrl: './setting-alert-modal.component.html',
  styleUrls: ['./setting-alert-modal.component.scss'],
})
export class SettingAlertModalComponent implements OnInit, OnDestroy {
  public maxIHB = 2147483647;
  public patientId: string = '';
  public isError = false;
  public bloodPressureLevel = bloodPressureLevel;
  public bpSmallerErr: string[] = [];
  public settingForm = this.formBuilder.group({
    patient_setting_alert_weight1_days: [
      null,
      {
        validators: settingAlertValidator.alert_weight1_days,
        updateOn: 'submit',
      },
    ],
    patient_setting_alert_weight1_ratio: [
      null,
      {
        validators: settingAlertValidator.alert_weight1_ratio,
        updateOn: 'submit',
      },
    ],
    patient_setting_alert_weight1_status: false,
    patient_setting_alert_weight2_days: [
      null,
      {
        validators: settingAlertValidator.alert_weight2_days,
        updateOn: 'submit',
      },
    ],
    patient_setting_alert_weight2_ratio: [
      null,
      {
        validators: settingAlertValidator.alert_weight2_ratio,
        updateOn: 'submit',
      },
    ],
    patient_setting_alert_weight2_status: false,
    patient_setting_alert_high_bp_sys: [
      null,
      {
        validators: settingAlertValidator.alert_high_bp_sys,
        updateOn: 'submit',
      },
    ],
    patient_setting_alert_high_bp_dia: [
      null,
      {
        validators: settingAlertValidator.alert_high_bp_dia,
        updateOn: 'submit',
      },
    ],
    patient_setting_alert_high_bp_status: false,
    patient_setting_alert_low_bp_sys: [
      null,
      {
        validators: settingAlertValidator.alert_low_bp_sys,
        updateOn: 'submit',
      },
    ],
    patient_setting_alert_low_bp_dia: [
      null,
      {
        validators: settingAlertValidator.alert_low_bp_dia,
        updateOn: 'submit',
      },
    ],
    patient_setting_alert_low_bp_status: false,
    patient_setting_alert_af1_times: [
      null,
      {
        validators: settingAlertValidator.alert_af1_times,
        updateOn: 'submit',
      },
    ],
    patient_setting_alert_af1_days: [
      null,
      {
        validators: settingAlertValidator.alert_af1_days,
        updateOn: 'submit',
      },
    ],
    patient_setting_alert_af1_status: false,
    patient_setting_alert_af2_times: [
      null,
      {
        validators: settingAlertValidator.alert_af2_times,
        updateOn: 'submit',
      },
    ],
    patient_setting_alert_af2_status: false,
    patient_setting_alert_ihb1_times: [
      null,
      {
        validators: settingAlertValidator.alert_ihb1_times,
        updateOn: 'submit',
      },
    ],
    patient_setting_alert_ihb1_days: [
      null,
      {
        validators: settingAlertValidator.alert_ihb1_days,
        updateOn: 'submit',
      },
    ],
    patient_setting_alert_ihb1_status: false,
    patient_setting_alert_ihb2_times: [
      null,
      {
        validators: settingAlertValidator.alert_ihb2_times,
        updateOn: 'submit',
      },
    ],
    patient_setting_alert_ihb2_status: false,
    updated_at: '',
    updated_by: '',
  });
  public subscriptions: Subscription = new Subscription();

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    public sharedService: SharedService,
    private patientService: PatientService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const param = {
      patient_id: this.patientId,
    };
    this.subscriptions.add(
      this.patientService.getAlertSetting(param).subscribe(
        (data) => {
          if (data) {
            this.settingForm.patchValue({
              ...data,
              updated_by: joinName(
                data.updated_by?.hcp_first_name,
                data.updated_by?.hcp_middle_name,
                data.updated_by?.hcp_last_name
              ),
            });
          }
          this.sharedService.showLoadingEventEmitter.emit(false);
          this.settingValidate();
        },
        (err: any) => {
          let errMessage = err.error.message ? err.error.message : this.translate.instant('error.server');
          this.toastService.show(errMessage, { className: 'bg-red-100' });
          this.sharedService.showLoadingEventEmitter.emit(false);
        }
      )
    );
  }

  ngOnDestroy() {
    this.sharedService.showLoadingEventEmitter.emit(false);
    this.subscriptions.unsubscribe();
  }

  /**
   * handle event when reset button is clicked
   */
  settingValidate(): void {
    const formControls = this.settingForm.controls;
    if (
      this.sharedService.hospitalSetting?.hospital_setting_functions?.ALERT?.BP?.hospital_setting_function_status &&
      this.settingForm.controls.patient_setting_alert_low_bp_status.value
    ) {
      this.settingForm.controls.patient_setting_alert_low_bp_sys.setValidators(settingAlertValidator.alert_low_bp_sys);

      this.settingForm.controls.patient_setting_alert_low_bp_dia.setValidators(settingAlertValidator.alert_low_bp_dia);
    } else {
      this.settingForm.controls.patient_setting_alert_low_bp_sys.clearValidators();
      this.settingForm.controls.patient_setting_alert_low_bp_dia.clearValidators();
      this.settingForm.controls.patient_setting_alert_low_bp_sys.setValue(
        formControls.patient_setting_alert_low_bp_sys.value || null
      );
      this.settingForm.controls.patient_setting_alert_low_bp_dia.setValue(
        formControls.patient_setting_alert_low_bp_dia.value || null
      );
    }

    if (
      this.sharedService.hospitalSetting?.hospital_setting_functions?.ALERT?.BP?.hospital_setting_function_status &&
      this.settingForm.controls.patient_setting_alert_high_bp_status.value
    ) {
      this.settingForm.controls.patient_setting_alert_high_bp_sys.setValidators(
        settingAlertValidator.alert_high_bp_sys
      );

      this.settingForm.controls.patient_setting_alert_high_bp_dia.setValidators(
        settingAlertValidator.alert_high_bp_dia
      );
    } else {
      this.settingForm.controls.patient_setting_alert_high_bp_sys.clearValidators();
      this.settingForm.controls.patient_setting_alert_high_bp_dia.clearValidators();
      this.settingForm.controls.patient_setting_alert_high_bp_sys.setValue(
        formControls.patient_setting_alert_high_bp_sys.value || null
      );
      this.settingForm.controls.patient_setting_alert_high_bp_dia.setValue(
        formControls.patient_setting_alert_high_bp_dia.value || null
      );
    }

    if (
      this.sharedService.hospitalSetting?.hospital_setting_functions?.ALERT?.WEIGHT?.hospital_setting_function_status &&
      this.settingForm.controls.patient_setting_alert_weight1_status.value
    ) {
      this.settingForm.controls.patient_setting_alert_weight1_ratio.setValidators(
        settingAlertValidator.alert_weight1_ratio
      );
      this.settingForm.controls.patient_setting_alert_weight1_days.setValidators(
        settingAlertValidator.alert_weight1_days
      );
    } else {
      this.settingForm.controls.patient_setting_alert_weight1_days.clearValidators();
      this.settingForm.controls.patient_setting_alert_weight1_ratio.clearValidators();
      this.settingForm.controls.patient_setting_alert_weight1_days.setValue(
        formControls.patient_setting_alert_weight1_days.value || null
      );
      this.settingForm.controls.patient_setting_alert_weight1_ratio.setValue(
        formControls.patient_setting_alert_weight1_ratio.value || null
      );
    }

    if (
      this.sharedService.hospitalSetting?.hospital_setting_functions?.ALERT?.WEIGHT?.hospital_setting_function_status &&
      this.settingForm.controls.patient_setting_alert_weight2_status.value
    ) {
      this.settingForm.controls.patient_setting_alert_weight2_ratio.setValidators(
        settingAlertValidator.alert_weight2_ratio
      );
      this.settingForm.controls.patient_setting_alert_weight2_days.setValidators(
        settingAlertValidator.alert_weight2_days
      );
    } else {
      this.settingForm.controls.patient_setting_alert_weight2_days.clearValidators();
      this.settingForm.controls.patient_setting_alert_weight2_ratio.clearValidators();
      this.settingForm.controls.patient_setting_alert_weight2_days.setValue(
        formControls.patient_setting_alert_weight2_days.value || null
      );
      this.settingForm.controls.patient_setting_alert_weight2_ratio.setValue(
        formControls.patient_setting_alert_weight2_ratio.value || null
      );
    }

    if (
      this.sharedService.hospitalSetting?.hospital_setting_functions?.ALERT?.AF?.hospital_setting_function_status &&
      this.settingForm.controls.patient_setting_alert_af1_status.value
    ) {
      this.settingForm.controls.patient_setting_alert_af1_days.setValidators(settingAlertValidator.alert_af1_days);
      this.settingForm.controls.patient_setting_alert_af1_times.setValidators(settingAlertValidator.alert_af1_times);
    } else {
      this.settingForm.controls.patient_setting_alert_af1_days.clearValidators();
      this.settingForm.controls.patient_setting_alert_af1_times.clearValidators();
      this.settingForm.controls.patient_setting_alert_af1_days.setValue(
        formControls.patient_setting_alert_af1_days.value || null
      );
      this.settingForm.controls.patient_setting_alert_af1_times.setValue(
        formControls.patient_setting_alert_af1_times.value || null
      );
    }

    if (
      this.sharedService.hospitalSetting?.hospital_setting_functions?.ALERT?.AF?.hospital_setting_function_status &&
      this.settingForm.controls.patient_setting_alert_af2_status.value
    ) {
      this.settingForm.controls.patient_setting_alert_af2_times.setValidators(settingAlertValidator.alert_af2_times);
    } else {
      this.settingForm.controls.patient_setting_alert_af2_times.clearValidators();
      this.settingForm.controls.patient_setting_alert_af2_times.setValue(
        formControls.patient_setting_alert_af2_times.value || null
      );
    }

    if (
      this.sharedService.hospitalSetting?.hospital_setting_functions?.ALERT?.IHB?.hospital_setting_function_status &&
      this.settingForm.controls.patient_setting_alert_ihb1_status.value
    ) {
      this.settingForm.controls.patient_setting_alert_ihb1_days.setValidators(settingAlertValidator.alert_ihb1_days);
      this.settingForm.controls.patient_setting_alert_ihb1_times.setValidators(settingAlertValidator.alert_ihb1_times);
    } else {
      this.settingForm.controls.patient_setting_alert_ihb1_days.clearValidators();
      this.settingForm.controls.patient_setting_alert_ihb1_times.clearValidators();
      this.settingForm.controls.patient_setting_alert_ihb1_days.setValue(
        formControls.patient_setting_alert_ihb1_days.value || null
      );
      this.settingForm.controls.patient_setting_alert_ihb1_times.setValue(
        formControls.patient_setting_alert_ihb1_times.value || null
      );
    }

    if (
      this.sharedService.hospitalSetting?.hospital_setting_functions?.ALERT?.IHB?.hospital_setting_function_status &&
      this.settingForm.controls.patient_setting_alert_ihb2_status.value
    ) {
      this.settingForm.controls.patient_setting_alert_ihb2_times.setValidators(settingAlertValidator.alert_ihb2_times);
    } else {
      this.settingForm.controls.patient_setting_alert_ihb2_times.clearValidators();
      this.settingForm.controls.patient_setting_alert_ihb2_times.setValue(
        formControls.patient_setting_alert_ihb2_times.value || null
      );
    }

    this.settingForm.controls.patient_setting_alert_weight1_days.updateValueAndValidity();
    this.settingForm.controls.patient_setting_alert_weight1_ratio.updateValueAndValidity();
    this.settingForm.controls.patient_setting_alert_weight2_days.updateValueAndValidity();
    this.settingForm.controls.patient_setting_alert_weight2_ratio.updateValueAndValidity();
    this.settingForm.controls.patient_setting_alert_af1_times.updateValueAndValidity();
    this.settingForm.controls.patient_setting_alert_af1_days.updateValueAndValidity();
    this.settingForm.controls.patient_setting_alert_af2_times.updateValueAndValidity();
    this.settingForm.controls.patient_setting_alert_low_bp_sys.updateValueAndValidity();
    this.settingForm.controls.patient_setting_alert_low_bp_dia.updateValueAndValidity();
    this.settingForm.controls.patient_setting_alert_high_bp_sys.updateValueAndValidity();
    this.settingForm.controls.patient_setting_alert_high_bp_dia.updateValueAndValidity();
    this.settingForm.controls.patient_setting_alert_ihb1_times.updateValueAndValidity();
    this.settingForm.controls.patient_setting_alert_ihb1_days.updateValueAndValidity();
    this.settingForm.controls.patient_setting_alert_ihb2_times.updateValueAndValidity();
  }

  /**
   * handle when submit button is clicked
   */
  onSubmit() {
    setTimeout(() => {
      this.bpSmallerErr = [];
      this.settingValidate();
      this.isError = this.settingForm.invalid || this.hasSmallerValue();
      const formValue = {
        ...this.settingForm.value,
      };
      delete formValue.updated_at;
      delete formValue.updated_by;

      if (!this.isError) {
        const params = { ...formValue, patient_id: this.patientId };
        this.subscriptions.add(
          this.patientService.setAlertSetting(params).subscribe(
            () => {
              this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
              this.sharedService.showLoadingEventEmitter.emit();
              this.activeModal.dismiss();
            },
            (err) => {
              let errMessage = err.error.message ? err.error.message : this.translate.instant('error.server');
              this.toastService.show(errMessage, { className: 'bg-red-100' });
              this.sharedService.showLoadingEventEmitter.emit();
              this.activeModal.dismiss();
            }
          )
        );
      }
    }, 0);
  }

  /**
   * Validate that sys field has lower value than dia field
   */
  hasSmallerValue() {
    if (
      this.settingForm.controls.patient_setting_alert_high_bp_status.value &&
      this.settingForm.controls.patient_setting_alert_high_bp_sys.value &&
      this.settingForm.controls.patient_setting_alert_high_bp_dia.value &&
      Number(this.settingForm.controls.patient_setting_alert_high_bp_sys.value) <=
        Number(this.settingForm.controls.patient_setting_alert_high_bp_dia.value)
    ) {
      this.bpSmallerErr.push(this.bloodPressureLevel.high);
    }

    if (
      this.settingForm.controls.patient_setting_alert_low_bp_status.value &&
      this.settingForm.controls.patient_setting_alert_low_bp_sys.value &&
      this.settingForm.controls.patient_setting_alert_low_bp_dia.value &&
      Number(this.settingForm.controls.patient_setting_alert_low_bp_sys.value) <=
        Number(this.settingForm.controls.patient_setting_alert_low_bp_dia.value)
    ) {
      this.bpSmallerErr.push(this.bloodPressureLevel.low);
    }

    return !!this.bpSmallerErr.length;
  }

  /**
   * handle when close is clicked
   */
  clickedCancel(): void {
    this.activeModal.dismiss();
  }
}
