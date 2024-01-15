import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationService } from '@data/services/registration/registration.service';
import { TranslateService } from '@ngx-translate/core';
import { handleName } from '@shared/helpers';
import { errorStatus, sex } from '@shared/helpers/data';
import { SharedService } from '@shared/services/shared.service';
import { StorageService } from '@shared/services/storage.service';
import { ToastService } from '@shared/services/toast.service';
@Component({
  selector: 'app-shinden-advice-register-confirm-data',
  templateUrl: './shinden-advice-register-confirm-data.component.html',
  styleUrls: ['./shinden-advice-register-confirm-data.component.scss'],
})
export class ShindenAdviceRegisterConfirmDataComponent implements OnInit {
  @Input() patient: any;
  @Output() backClicked: EventEmitter<any> = new EventEmitter();

  public sex = JSON.parse(JSON.stringify(sex));
  private hospitalCode: string = '';

  constructor(
    public sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private registrationService: RegistrationService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.hospitalCode = this.route.snapshot.queryParams['hospital_code'];
  }

  /**
   * function when click register
   */
  onRegisterClicked() {
    this.handleName(this.patient.full_name);
    let emailVerified = this.patient.emailVerified;
    delete this.patient.emailVerified;
    let submittedPatient = JSON.parse(JSON.stringify(this.patient));
    if (!submittedPatient.note) delete submittedPatient.note;
    delete submittedPatient.full_name;
    if (emailVerified) {
      delete submittedPatient.email;
      submittedPatient.hospital_code = this.hospitalCode;
      this.registrationService.registerShinden(submittedPatient).subscribe(
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
          } else {
            this.patient.emailVerified = emailVerified;
            this.backClicked.emit();
          }
        }
      );
    } else {
      this.storageService.setToSession('currentPatientData', submittedPatient);
      this.router.navigate(['/shinden-registration/shinden-advice/confirm'], {
        queryParams: { hospital_code: this.hospitalCode, code: this.storageService.getFromSession('omronCode') },
      });
    }
  }

  /**
   * handle when create button is clicked
   */
  handleName(data: any): void {
    let name = handleName(data.trim());
    this.patient.first_name = name[0];
    this.patient.middle_name = name[1];
    this.patient.last_name = name[2];
  }
}
