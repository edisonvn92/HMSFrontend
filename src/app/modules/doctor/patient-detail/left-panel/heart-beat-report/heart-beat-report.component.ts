import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '@shared/services/shared.service';
import { ReportHistoryModalComponent } from '@modules/doctor/patient-detail/modals/report-history-modal/report-history-modal.component';
import { SelectMonthReportComponent } from '@modules/doctor/patient-detail/modals/select-month-report/select-month-report.component';
import { showDate } from '@shared/helpers';

@Component({
  selector: 'app-heart-beat-report',
  templateUrl: './heart-beat-report.component.html',
  styleUrls: ['./heart-beat-report.component.scss'],
})
export class HeartBeatReportComponent {
  @Input() patient: any = {};
  @Input() patientId: string = '';
  @Output() shindenDownloadReportSuccess: EventEmitter<any> = new EventEmitter();

  constructor(public modalService: NgbModal, public sharedService: SharedService) {}

  /**
   * show modal history
   */
  modalHistoryReport() {
    const modalRef = this.modalService.open(ReportHistoryModalComponent, {
      backdrop: 'static',
      size: 'lg',
      modalDialogClass: 'w-560',
    });
    modalRef.componentInstance.patientId = this.patientId;
    modalRef.componentInstance.patient = this.patient;
  }

  /**
   * show modal select month report
   */
  modalSelectMonthReport() {
    const modalRef = this.modalService.open(SelectMonthReportComponent, {
      backdrop: 'static',
      size: 'lg',
      modalDialogClass: 'w-421',
    });
    modalRef.componentInstance.patientId = this.patientId;
    modalRef.componentInstance.patient = this.patient;
    modalRef.closed.subscribe(() => {
      this.shindenDownloadReportSuccess.emit();
    });
  }

  /**
   * show date
   */
  showDate() {
    return showDate(
      this.patient?.shinden_download_history_utc_time,
      this.sharedService.isJa() ? 'YYYY/MM/DD' : 'D MMM YYYY'
    );
  }
}
