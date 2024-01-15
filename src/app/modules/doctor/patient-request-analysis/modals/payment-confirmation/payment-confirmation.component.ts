import { Component } from '@angular/core';
import { ShindenService } from '@data/services/doctor/shinden.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { paymentStatus } from '@shared/helpers/data';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.scss'],
})
export class PaymentConfirmationComponent {
  public isCancel: boolean = false;
  public patient: any;

  constructor(
    public activeModal: NgbActiveModal,
    public sharedService: SharedService,
    private shindenService: ShindenService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  /**
   * handle when close is clicked
   */
  clickedClose(): void {
    this.activeModal.dismiss();
  }

  /**
   * handle when close is clicked
   */
  clickedCSubmit(): void {
    this.shindenService
      .changePayment({
        patient_id: this.patient.patient_id,
        patient_analysis_id: this.patient.patient_analysis_id,
        patient_analysis_status: this.patient.patient_analysis_status
          ? paymentStatus.UNPAID
          : paymentStatus.PAID_INCOMPLETE,
      })
      .subscribe(
        () => {
          this.activeModal.close();
          this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
        },
        () => {
          let field = this.translate.instant('Patient');
          let mess = this.translate.instant(':field does not exist', { field: field });
          this.toastService.show(mess, { className: 'bg-red-100' });
          this.activeModal.close();
        }
      );
  }
}
