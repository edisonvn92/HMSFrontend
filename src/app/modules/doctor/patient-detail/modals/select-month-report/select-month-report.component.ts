import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { ShindenService } from '@services/doctor/shinden.service';
import { SharedService } from '@shared/services/shared.service';
import { Subscription } from 'rxjs';
import { ToastService } from '@shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { downloadPdf } from '@shared/helpers';
import { defaultPatientLanguage } from '@shared/helpers/data';
import moment from 'moment';

@Component({
  selector: 'app-select-month-report',
  templateUrl: './select-month-report.component.html',
  styleUrls: ['./select-month-report.component.scss'],
})
export class SelectMonthReportComponent implements OnInit {
  @ViewChild('selectmonthreportDropdown', { static: false, read: NgbDropdown })
  ngbSelectMonthReportDropdown!: NgbDropdown;
  public subscriptions: Subscription = new Subscription();
  public dataMonths: any = [];
  public patientId!: string;
  public patient: any = {};
  public patientReportMonth!: string;
  public patientReportEndDate!: string;
  patientLanguage: string = defaultPatientLanguage;
  timezoneOffset = new Date().getTimezoneOffset();

  constructor(
    public activeModal: NgbActiveModal,
    public shindenService: ShindenService,
    private toastService: ToastService,
    private translate: TranslateService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getPatientReportList();
  }

  /**
   * get patient shinden report list
   */
  public getPatientReportList() {
    this.shindenService
      .getPatientReportList({
        patient_id: this.patientId,
        timezone_offset: this.timezoneOffset,
      })
      .subscribe(
        (data) => {
          this.dataMonths = data;
          this.sharedService.showLoadingEventEmitter.emit(false);
        },
        (err) => {
          this.sharedService.showLoadingEventEmitter.emit(false);
          let errMessage = err.error.message ? err.error.message : this.translate.instant('error.server');
          this.toastService.show(errMessage, { className: 'bg-red-100' });
        }
      );
  }

  /**
   * shinden report download
   */
  public shindenDownloadReport(patientReportEndDate: any) {
    if (this.patient.user_language) this.patientLanguage = this.patient.user_language;
    if (patientReportEndDate) {
      this.subscriptions.add(
        this.shindenService
          .shindenDownloadReportHandmade({
            patient_id: this.patientId,
            end_date: this.patientReportEndDate,
            timezone_offset: this.timezoneOffset,
          })
          .subscribe(
            (response: any) => {
              let pdfName = response.headers
                .get('content-disposition')
                .split('filename=')[1]
                .split(';')[0]
                .split('_')[0];
              pdfName = pdfName.substring(1, pdfName.length);
              let fileName = `${decodeURIComponent(pdfName)}_${this.patient.patient_code}_${moment().format(
                'YYYYMMDDHHmm'
              )}.pdf`;
              downloadPdf(fileName, response.body as string);
              this.sharedService.showLoadingEventEmitter.emit(false);
              this.activeModal.close();
            },
            (err) => {
              this.sharedService.showLoadingEventEmitter.emit(false);
              let errMessage = err.error.message ? err.error.message : this.translate.instant('error.server');
              this.toastService.show(errMessage, { className: 'bg-red-100' });
            }
          )
      );
    }
  }

  /**
   * Handles the event when the reset button is clicked.
   */
  public selectedItem(field: any) {
    this.patientReportEndDate = field.vital_heart_beat_end_date;
    this.patientReportMonth = field.vital_heart_beat_month;
    this.ngbSelectMonthReportDropdown.toggle();
  }

  /**
   * handle when close is clicked
   */
  clickedClose(): void {
    this.activeModal.dismiss();
  }
}
