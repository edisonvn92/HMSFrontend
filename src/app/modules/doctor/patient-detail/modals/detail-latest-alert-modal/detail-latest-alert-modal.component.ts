import { Component, OnDestroy } from '@angular/core';
import { PatientService } from '@data/services/doctor/patient.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { fixNumber, getPluralNoun } from '@shared/helpers';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import { alertNewStatus } from '@shared/helpers/data';
import { alertType } from '@shared/helpers/data';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detail-latest-alert-modal',
  templateUrl: './detail-latest-alert-modal.component.html',
  styleUrls: ['./detail-latest-alert-modal.component.scss'],
})
export class DetailLatestAlertModalComponent implements OnDestroy {
  isDetail = false;
  patient_id = '';
  dataChild: any;
  memo = '';
  alertNewStatus = alertNewStatus;
  alertType = alertType;
  public list_alert_new_id: Array<number> = [];
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
   * handle when close is clicked
   */
  clickedClose(): void {
    this.activeModal.dismiss();
  }

  /**
   * Handles the event when the confirm button is clicked.
   */
  confirmClicked(): void {
    this.subscriptions.add(
      this.patientService
        .confirmDetailAlert({
          patient_id: this.patient_id,
          alert_memo: this.memo,
          list_alert_new_id: this.list_alert_new_id,
        })
        .subscribe(
          () => {
            this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
            this.activeModal.close();
          },
          (err: any) => {
            let errMessage = err.error.message ? err.error.message : this.translate.instant('error.server');
            this.toastService.show(errMessage, { className: 'bg-red-100' });
            this.sharedService.showLoadingEventEmitter.emit();
            this.activeModal.close();
          }
        )
    );
  }

  /**
   *Handles the event when the leave button is clicked.
   */
  leaveListClicked(): void {
    this.subscriptions.add(
      this.patientService
        .deleteDetailAlert({
          patient_id: this.patient_id,
          alert_memo: this.memo,
          list_alert_new_id: this.list_alert_new_id,
        })
        .subscribe(
          () => {
            this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
            this.activeModal.close();
          },
          (err: any) => {
            let errMessage = err.error.message ? err.error.message : this.translate.instant('error.server');
            this.toastService.show(errMessage, { className: 'bg-red-100' });
            this.sharedService.showLoadingEventEmitter.emit();
            this.activeModal.close();
          }
        )
    );
  }

  /**
   * take numberFix digit after comma
   *
   * @param value - value need handle
   * @param numberFix -
   */
  public fixNumber(value: number, numberFix: number = 1): string {
    return fixNumber(value, numberFix);
  }

  /**
   * get text noun in en language
   * @param singularNoun
   * @param pluralNoun
   * @param value
   * @param textJa
   * @returns
   */
  getPluralNoun(singularNoun: string, pluralNoun: string, value: number, textJa: string): string {
    if (this.sharedService.isJa()) return this.translate.instant(textJa);
    return getPluralNoun(this.translate.instant(singularNoun), this.translate.instant(pluralNoun), value);
  }
}
