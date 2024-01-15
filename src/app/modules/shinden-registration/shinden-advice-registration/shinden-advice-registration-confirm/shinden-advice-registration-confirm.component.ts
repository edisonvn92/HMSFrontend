import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationService } from '@data/services/registration/registration.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { errorStatus } from '@shared/helpers/data';
import { SharedService } from '@shared/services/shared.service';
import { StorageService } from '@shared/services/storage.service';
import { ToastService } from '@shared/services/toast.service';
import { MailSentModalComponent } from './mail-sent-modal/mail-sent-modal.component';

@Component({
  selector: 'app-shinden-advice-registration-confirm',
  templateUrl: './shinden-advice-registration-confirm.component.html',
  styleUrls: ['./shinden-advice-registration-confirm.component.scss'],
})
export class ShindenAdviceRegistrationConfirmComponent implements OnInit {
  patient: any = {};
  hospitalCode: string = '';
  isError: boolean = false;
  patientEmail: string = '';

  constructor(
    private storageService: StorageService,
    private registrationService: RegistrationService,
    private translate: TranslateService,
    private toastService: ToastService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.hospitalCode = this.route.snapshot.queryParams['hospital_code'];
    this.patient = this.storageService.getFromSession('currentPatientData');
    if (!this.patient) {
      this.router.navigate(['/shinden-registration/shinden-advice/top'], {
        queryParams: { hospital_code: this.hospitalCode },
      });
    } else {
      this.patientEmail = this.patient.email;
      this.patient.hospital_code = this.hospitalCode;
    }
    let code = this.route.snapshot.queryParams['code'];
    if (code !== this.storageService.getFromSession('omronCode')) {
      this.storageService.setToSession('omronCode', code);
      this.registrationService.omronConnect({ code }).subscribe(
        (result: any) => {
          this.storageService.setToSession('omronAccessToken', result.access_token);
          this.sharedService.showLoadingEventEmitter.emit(false);
        },
        (error: any) => {
          let errMessage = error.error.message
            ? this.translate.instant(`error.${error.error.message}`)
            : this.translate.instant('error.server');
          this.toastService.show(errMessage, { className: 'bg-red-100' });
          this.sharedService.showLoadingEventEmitter.emit(false);
          this.router.navigate(['/shinden-registration/shinden-advice/top'], {
            queryParams: { hospital_code: this.hospitalCode },
          });
        }
      );
    }
  }

  /**
   * function when click to send confirmation email
   */
  onSendEmailClicked() {
    this.registrationService
      .sendConfirmationEmail({
        access_token: this.storageService.getFromSession('omronAccessToken'),
      })
      .subscribe(
        () => {
          this.sharedService.showLoadingEventEmitter.emit(false);
          this.modalService.open(MailSentModalComponent, {
            backdrop: 'static',
            modalDialogClass: 'w-280 mx-auto mt-30vh ',
          });
        },
        (error) => {
          let errMessage = error.error.message ? error.error.message : this.translate.instant('error.server');
          this.toastService.show(errMessage, { className: 'bg-red-100' });
          this.sharedService.showLoadingEventEmitter.emit(false);
        }
      );
  }

  /**
   * function when click to proceed
   */
  onFinishClicked() {
    delete this.patient.email;
    this.registrationService.getB2BUserProfile(this.patient.ogsc_access_token).subscribe(
      (data: any) => {
        if (data.returnedValue.email_verified) {
          this.isError = false;
          this.registrationService.registerShinden(this.patient).subscribe(
            (res) => {
              this.storageService.removeFromSession('omronCode');
              this.storageService.removeFromSession('omronAccessToken');
              this.router.navigate(['/shinden-registration/shinden-advice/complete'], {
                queryParams: { hospital_code: this.hospitalCode },
              });
              this.sharedService.showLoadingEventEmitter.emit(false);
            },
            (error) => {
              let errMessage = error.error.message ? error.error.message : this.translate.instant('error.server');
              this.toastService.show(errMessage, { className: 'bg-red-100' });
              this.sharedService.showLoadingEventEmitter.emit(false);
              if (error.status === errorStatus.BAD_REQUEST_CODE || error.status === errorStatus.UNAUTHORIZED_CODE) {
                this.router.navigate(['/shinden-registration/shinden-advice/top'], {
                  queryParams: { hospital_code: this.hospitalCode },
                });
              }
            }
          );
        } else {
          this.isError = true;
        }
      },
      (error: any) => {
        let errMessage = error.error.message ? error.error.message : this.translate.instant('error.server');
        this.toastService.show(errMessage, { className: 'bg-red-100' });
        this.sharedService.showLoadingEventEmitter.emit(false);
        this.router.navigate(['/shinden-registration/shinden-advice/top'], {
          queryParams: { hospital_code: this.hospitalCode },
        });
      }
    );
  }
}
