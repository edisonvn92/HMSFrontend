import { Component, OnDestroy } from '@angular/core';
import { IPatientBasicInfo } from '@data/models/patientDetail';
import { PatientService } from '@data/services/doctor/patient.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { joinName } from '@shared/helpers';
import { ToastService } from '@shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '@shared/services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-medical-modal',
  templateUrl: './medical-modal.component.html',
  styleUrls: ['./medical-modal.component.scss'],
})
export class MedicalModalComponent implements OnDestroy {
  public isRegister!: boolean;
  patient: IPatientBasicInfo | any = {};
  public joinName = joinName;
  public patientId = '';
  public today = new Date();
  public subscriptions: Subscription = new Subscription();

  constructor(
    public activeModal: NgbActiveModal,
    public patientService: PatientService,
    public toastService: ToastService,
    public translate: TranslateService,
    public sharedService: SharedService
  ) {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * close
   */
  public clickedClose() {
    this.activeModal.dismiss();
  }

  /**
   * Handles the event when the delete button is clicked.
   */
  public deleteClicked(): void {
    const id = this.patient.medical_register_id;
    this.subscriptions.add(
      this.patientService.deleteMedicalRegister({ medical_register_id: id }).subscribe(
        () => {
          this.activeModal.close();
        },
        () => {
          let field = this.translate.instant('Patient');
          let mess = this.translate.instant(':field does not exist', { field: field });
          this.toastService.show(mess, { className: 'bg-red-100' });
          this.activeModal.close();
        }
      )
    );
  }

  /**
   *
   */
  public registerClicked(): void {
    this.subscriptions.add(
      this.patientService
        .confirmMedicalRegister({
          patient_id: this.patientId,
          timezone_offset: new Date().getTimezoneOffset(),
        })
        .subscribe(
          () => {
            this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
            this.activeModal.close();
          },
          (err: any) => {
            let errMessage = err.error.message ? err.error.message : this.translate.instant('error.server');
            this.toastService.show(errMessage, { className: 'bg-red-100' });
            this.activeModal.close();
          }
        )
    );
  }
}
