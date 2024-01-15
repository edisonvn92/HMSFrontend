import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IMail } from '@data/models/mail';
import { PatientService } from '@data/services/doctor/patient.service';
import { TranslateService } from '@ngx-translate/core';
import { downloadPdf, getLinkMail, joinName, showDate } from '@shared/helpers';
import { bloodPressureReportName, componentCode, defaultPatientLanguage, mailStatus } from '@shared/helpers/data';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import moment from 'moment';

@Component({
  selector: 'app-mail-report',
  templateUrl: './mail-report.component.html',
  styleUrls: ['./mail-report.component.scss'],
})
export class MailReportComponent {
  @Input() patient: any = {};
  @Input() patientId: string = '';
  @Input() hospitalCodeList: any;
  @Output() mailReportSuccess: EventEmitter<any> = new EventEmitter();

  public mail: IMail = { mailto: '', body: '' };
  public mailLink!: string;
  public componentCode = componentCode;
  patientLanguage: string = defaultPatientLanguage;
  constructor(
    private patientService: PatientService,
    public sharedService: SharedService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  /**
   * handle event when mail button is clicked
   */
  openMailer() {
    this.mail.mailto = this.patient.patient_email;
    if (this.patient && this.patient.user_email_verified && this.patient.patient_email) {
      this.patientService
        .getMailTemplate({ hospital_email_template_language: this.patient.user_language || defaultPatientLanguage })
        .subscribe(
          (data: any) => {
            if (data) {
              this.mail.subject = data.hospital_email_template_subject;
              this.mail.body = data.hospital_email_template_message.replaceAll(
                '{{patient_name}}',
                joinName(
                  this.patient.patient_first_name,
                  this.patient.patient_middle_name,
                  this.patient.patient_last_name
                )
              );
            }
            this.mailLink = getLinkMail(this.mail);
            location.assign(this.mailLink);
            this.setTimeOpenMail();
          },
          (err: any) => {
            let errMessage = err.error.message ? err.error.message : this.translate.instant('error.server');
            this.toastService.show(errMessage, { className: 'bg-red-100' });
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        );
    } else {
      let errMessage = this.translate.instant('email cannot be sent');
      this.toastService.show(errMessage, { className: 'bg-red-100' });
    }
  }

  /**
   * Call api set time invoke mail
   */
  setTimeOpenMail() {
    const body = {
      patient_id: this.patientId,
      patient_email_status: mailStatus.SUCCESS,
    };
    this.patientService.setTimeInvokeMailer(body).subscribe(
      () => {
        this.mailReportSuccess.emit();
      },
      (err: any) => {
        let errMessage = err.error.message ? err.error.message : this.translate.instant('error.server');
        this.toastService.show(errMessage, { className: 'bg-red-100' });
        this.sharedService.showLoadingEventEmitter.emit(false);
      }
    );
  }

  /**
   * show date
   */
  showDate(date: string) {
    return showDate(date, this.sharedService.isJa() ? 'YYYY/MM/DD' : 'D MMM YYYY');
  }

  /**
   * download blood pressure report
   */
  downloadReport() {
    if (this.patient.user_language) this.patientLanguage = this.patient.user_language;
    let reportDate = moment().format();
    this.patientService
      .exportPatientBloodPressureReport({
        patient_id: this.patientId,
        end_date: moment(reportDate).format('YYYY-MM-DD'),
        timezone_offset: new Date().getTimezoneOffset(),
      })
      .subscribe(
        (base64Data: any) => {
          let fileName = `${bloodPressureReportName[this.patientLanguage]}_${this.patient.patient_code}_${moment(
            reportDate
          ).format('YYYYMMDDHHmm')}.pdf`;
          downloadPdf(fileName, base64Data);
          this.mailReportSuccess.emit();
        },
        () => {
          this.sharedService.showLoadingEventEmitter.emit(false);
        }
      );
  }
}
