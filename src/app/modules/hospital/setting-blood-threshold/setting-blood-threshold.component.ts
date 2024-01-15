import { ThresholdBPService } from './../../../data/services/hospital/threshold-bp.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HospitalService } from '@data/services/hospital/hospital.service';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting-blood-threshold',
  templateUrl: './setting-blood-threshold.component.html',
  styleUrls: ['./setting-blood-threshold.component.scss'],
})
export class SettingBloodThresholdComponent implements OnInit {
  isError = false;
  error: string[] = [];
  validators = [Validators.required, Validators.min(1), Validators.max(300)];
  public settingForm = this.formBuilder.group({
    hospital_threshold_bp_black_dia: [
      null,
      {
        validators: this.validators,
        updateOn: 'submit',
      },
    ],
    hospital_threshold_bp_black_sys: [
      null,
      {
        validators: this.validators,
        updateOn: 'submit',
      },
    ],
    hospital_threshold_bp_dark_red_dia: [
      null,
      {
        validators: this.validators,
        updateOn: 'submit',
      },
    ],
    hospital_threshold_bp_dark_red_sys: [
      null,
      {
        validators: this.validators,
        updateOn: 'submit',
      },
    ],
  });

  constructor(
    private hospitalService: HospitalService,
    public sharedService: SharedService,
    private formBuilder: FormBuilder,
    private thresholdBPService: ThresholdBPService,
    private toastService: ToastService,
    private translate: TranslateService,
    public router: Router
  ) {}

  ngOnInit(): void {
    const param = {
      tables: ['hospital_setting', 'hospital_threshold_bp'],
    };
    this.hospitalService.getHospitalSetting(param).subscribe(
      (data) => {
        this.sharedService.hospitalSetting = data;
        if (data && !data.hospital_setting?.hospital_setting_threshold_bp) {
          this.router.navigate(['/hospital/home']);
        } else if (data && data.hospital_threshold_bp) {
          this.settingForm.patchValue(data.hospital_threshold_bp);
        }

        this.sharedService.showLoadingEventEmitter.emit(false);
      },
      (err) => {
        let errMessage = err.error.message ? err.error.message : this.translate.instant('error.server');
        this.toastService.show(errMessage, { className: 'bg-red-100' });
        this.sharedService.showLoadingEventEmitter.emit();
      }
    );
  }

  /**
   * handle when submit button is clicked
   */
  onSubmit() {
    setTimeout(() => {
      this.error = [];
      this.isError = this.settingForm.invalid || this.hasSmallerValue();
      if (!this.isError) {
        this.thresholdBPService.update(this.settingForm.value).subscribe(
          () => {
            this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
            this.sharedService.showLoadingEventEmitter.emit();
          },
          (err) => {
            let errMessage = err.error.message ? err.error.message : this.translate.instant('error.server');
            this.toastService.show(errMessage, { className: 'bg-red-100' });
            this.sharedService.showLoadingEventEmitter.emit();
          }
        );
      }
    }, 0);
  }

  /**
   * Validate that one field has lower value than dia field
   */
  hasSmallerValue() {
    if (
      (this.settingForm.controls.hospital_threshold_bp_black_sys.value &&
        this.settingForm.controls.hospital_threshold_bp_black_dia.value &&
        Number(this.settingForm.controls.hospital_threshold_bp_black_sys.value) <
          Number(this.settingForm.controls.hospital_threshold_bp_black_dia.value)) ||
      (this.settingForm.controls.hospital_threshold_bp_dark_red_sys.value &&
        this.settingForm.controls.hospital_threshold_bp_dark_red_dia.value &&
        Number(this.settingForm.controls.hospital_threshold_bp_dark_red_sys.value) <
          Number(this.settingForm.controls.hospital_threshold_bp_dark_red_dia.value))
    ) {
      this.error.push('bpSmaller');
    }

    if (
      this.settingForm.controls.hospital_threshold_bp_black_sys.value &&
      this.settingForm.controls.hospital_threshold_bp_black_dia.value &&
      this.settingForm.controls.hospital_threshold_bp_dark_red_sys.value &&
      this.settingForm.controls.hospital_threshold_bp_dark_red_dia.value &&
      (Number(this.settingForm.controls.hospital_threshold_bp_black_sys.value) <=
        Number(this.settingForm.controls.hospital_threshold_bp_dark_red_sys.value) ||
        Number(this.settingForm.controls.hospital_threshold_bp_black_dia.value) <=
          Number(this.settingForm.controls.hospital_threshold_bp_dark_red_dia.value))
    ) {
      this.error.push('levelSmaller');
    }

    return !!this.error.length;
  }
}
