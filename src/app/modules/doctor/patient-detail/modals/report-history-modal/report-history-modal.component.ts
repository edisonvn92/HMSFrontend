import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ShindenService } from '@services/doctor/shinden.service';
import { SharedService } from '@shared/services/shared.service';
import { scrollToTop, downloadPdf } from '@shared/helpers';
import { Subscription } from 'rxjs';
import { ToastService } from '@shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { bloodECGReportName, defaultPatientLanguage } from '@shared/helpers/data';
import moment from 'moment';

@Component({
  selector: 'app-report-history-modal',
  templateUrl: './report-history-modal.component.html',
  styleUrls: ['./report-history-modal.component.scss'],
})
export class ReportHistoryModalComponent implements OnInit, OnDestroy {
  public patientId!: string;
  public patient: any = {};

  public bodyRequest = {
    limit: 20,
    page: 1,
    total: 0,
  };
  public heartBeatReportHistory: any = {
    per_page: 20,
    total: 0,
    data: [],
  };
  public subscriptions: Subscription = new Subscription();
  patientLanguage: string = defaultPatientLanguage;

  constructor(
    public activeModal: NgbActiveModal,
    public shindenService: ShindenService,
    private toastService: ToastService,
    private translate: TranslateService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getHistoryReport();
  }

  ngOnDestroy() {
    this.sharedService.showLoadingEventEmitter.emit(false);
    this.subscriptions.unsubscribe();
  }

  /**
   * handle when page changed
   * @param data
   */
  public pageChange(data?: any): void {
    if (data) {
      this.bodyRequest.limit = data.perPage;
      this.bodyRequest.page = data.page;
    }
    this.getHistoryReport();
  }

  /**
   * get step count history
   */
  public getHistoryReport() {
    scrollToTop('history-content');
    this.subscriptions.add(
      this.shindenService
        .getHistoryReport({
          patient_id: this.patientId,
          sort: {
            attributes: 'created_at',
            type: 'desc',
          },
          page: this.bodyRequest.page,
          limit: this.bodyRequest.limit,
        })
        .subscribe(
          (data) => {
            this.heartBeatReportHistory = data;
            this.sharedService.showLoadingEventEmitter.emit(false);
          },
          (err) => {
            this.sharedService.showLoadingEventEmitter.emit(false);
            let errMessage = err.error.message ? err.error.message : this.translate.instant('error.server');
            this.toastService.show(errMessage, { className: 'bg-red-100' });
          }
        )
    );
  }

  /**
   * shinden report download
   */
  public shindenDownloadReport(data: any) {
    if (this.patient.user_language) this.patientLanguage = this.patient.user_language;
    this.subscriptions.add(
      this.shindenService
        .shindenDownloadReport({
          patient_report_id: data.patient_report.patient_report_id,
        })
        .subscribe(
          (base64Data: any) => {
            let fileName = `${bloodECGReportName[this.patientLanguage]}_${this.patient.patient_code}_${moment().format(
              'YYYYMMDDHHmm'
            )}.pdf`;
            downloadPdf(fileName, base64Data);
            this.sharedService.showLoadingEventEmitter.emit(false);
          },
          (err) => {
            this.sharedService.showLoadingEventEmitter.emit(false);
            let errMessage = err.error.message ? err.error.message : this.translate.instant('error.server');
            this.toastService.show(errMessage, { className: 'bg-red-100' });
          }
        )
    );
  }

  /**
   * handle when close is clicked
   */
  clickedClose(): void {
    this.activeModal.dismiss();
  }
}
