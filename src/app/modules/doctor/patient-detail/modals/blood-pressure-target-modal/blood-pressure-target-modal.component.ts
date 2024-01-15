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

@Component({
  selector: 'app-blood-pressure-target-modal',
  templateUrl: './blood-pressure-target-modal.component.html',
  styleUrls: ['./blood-pressure-target-modal.component.scss'],
})
export class BloodPressureTargetModalComponent implements OnInit, OnDestroy {
  serverErr = false;
  errMess = '';
  patient!: IPatientBasicInfo;
  patientId = '';
  minSys = 25;
  maxSys = 280;
  minDia = 25;
  maxDia = 255;
  submitGoal = false;
  public groupForm: any;
  public subscriptions: Subscription = new Subscription();

  constructor(
    public activeModal: NgbActiveModal,
    private patientService: PatientService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.groupForm = this.formBuilder.group(
      {
        sys: [
          this.patient.patient_sys_goal ? this.patient.patient_sys_goal : undefined,
          {
            validators: [Validators.required, Validators.min(this.minSys), Validators.max(this.maxSys)],
            updateOn: 'submit',
          },
        ],
        dia: [
          this.patient.patient_dia_goal ? this.patient.patient_dia_goal : undefined,
          {
            validators: [Validators.required, Validators.min(this.minDia), Validators.max(this.maxDia)],
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
    this.submitGoal = true;
    setTimeout(() => {
      if (this.groupForm.valid) {
        this.serverErr = false;
        this.subscriptions.add(
          this.patientService
            .setTargetBloodPressure({
              patient_id: this.patientId,
              patient_sys_goal: Number(this.groupForm.value['sys']),
              patient_dia_goal: Number(this.groupForm.value['dia']),
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
    }, 0);
  }

  get sysField() {
    return this.groupForm.get('sys')!;
  }

  get diaField() {
    return this.groupForm.get('dia')!;
  }
}
