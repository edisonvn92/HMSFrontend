import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IPatientBasicInfo } from '@data/models/patientDetail';
import { PatientService } from '@data/services/doctor/patient.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import BaseValidators from '@shared/validators/base.validator';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { componentCode } from '@shared/helpers/data';

@Component({
  selector: 'app-office-blood-pressure-modal',
  templateUrl: './office-blood-pressure-modal.component.html',
  styleUrls: ['./office-blood-pressure-modal.component.scss'],
})
export class OfficeBloodPressureModalComponent implements OnInit, OnDestroy {
  serverErr = false;
  errMess = '';
  patient: IPatientBasicInfo | any = {};
  hospitalSetting: any = {};
  patientId = '';
  groupForm: any;
  minSys = 25;
  maxSys = 280;
  minDia = 25;
  maxDia = 255;
  minPulse = 30;
  maxPulse = 200;
  currentTime: Date = new Date();
  currentSys = this.minSys;
  currentDia = this.minDia;
  currentPulse = this.minPulse;
  submitted = false;
  standardized = false;
  standardizedComponent: any = {};
  public subscriptions: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private patientService: PatientService,
    public sharedService: SharedService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.standardizedComponent = this.hospitalSetting?.hospital_dashboards
      ? this.hospitalSetting?.hospital_dashboards.find(
          (item: any) => item.components.component_code === componentCode.STANDARDIZED
        )
      : null;
    this.currentSys =
      this.patient && this.patient.vital_office_systolic ? this.patient.vital_office_systolic : undefined;
    this.currentDia =
      this.patient && this.patient.vital_office_diastolic ? this.patient.vital_office_diastolic : undefined;
    this.currentPulse = this.patient && this.patient.vital_office_pulse ? this.patient.vital_office_pulse : undefined;
    this.standardized =
      this.patient && this.patient.vital_office_standardized ? this.patient.vital_office_standardized : undefined;
    this.groupForm = this.formBuilder.group(
      {
        sys: [
          this.currentSys,
          {
            validators: [Validators.required, Validators.min(this.minSys), Validators.max(this.maxSys)],
            updateOn: 'submit',
          },
        ],
        dia: [
          this.currentDia,
          {
            validators: [Validators.required, Validators.min(this.minDia), Validators.max(this.maxDia)],
            updateOn: 'submit',
          },
        ],
        pulse: [
          this.currentPulse,
          {
            updateOn: 'submit',
          },
        ],
        standardized: [
          this.standardized,
          {
            updateOn: 'submit',
          },
        ],
      },
      {
        validators: [BaseValidators.hasSmallerValue('dia', 'sys')],
      }
    );
  }

  ngOnDestroy() {
    this.sharedService.showLoadingEventEmitter.emit(false);
    this.subscriptions.unsubscribe();
  }

  /**
   * handle when close button is clicked
   */
  clickedClose(): void {
    this.activeModal.dismiss('Notify click');
  }

  /**
   * click save to save target blood pressure
   */
  submitClicked() {
    this.submitted = true;
    setTimeout(() => {
      if (this.groupForm.valid) {
        this.serverErr = false;
        this.subscriptions.add(
          this.patientService
            .setOfficeBloodPressure({
              patient_id: this.patientId,
              vital_office_systolic: this.sysField.value,
              vital_office_diastolic: this.diaField.value,
              vital_office_pulse: this.pulseField.value,
              vital_office_standardized: this.standardized ? 1 : 0,
              timezone_offset: new Date().getTimezoneOffset(),
            })
            .pipe(delay(1000))
            .subscribe(
              () => {
                this.sharedService.showLoadingEventEmitter.emit(false);
                this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
                this.activeModal.close();
              },
              (error) => {
                this.serverErr = true;
                this.errMess = error.error.message ? error.error.message : 'error.server';
              }
            )
        );
      }
    }, 10);
  }

  get sysField() {
    return this.groupForm.get('sys')!;
  }

  get diaField() {
    return this.groupForm.get('dia')!;
  }

  get pulseField() {
    return this.groupForm.get('pulse')!;
  }

  /**
   * event when checkbox is clicked and change
   * @param event click event
   */
  onChangeCheckbox() {
    this.standardized = !this.standardized;
  }
}
