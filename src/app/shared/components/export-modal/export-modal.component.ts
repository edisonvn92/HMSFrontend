import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PatientService } from '@data/services/doctor/patient.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { downloadZip } from '@shared/helpers';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import moment from 'moment';

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.scss'],
})
export class ExportModalComponent implements OnInit {
  public groupId = '';
  public patientId = 0;
  public formatType = 'YYYY-MM-DD';
  startPeriod = new Date();
  endPeriod = new Date();
  currentDate = new Date();
  submitted = false;
  groupForm = this.formBuilder.group({
    export_type: [
      undefined,
      {
        validators: [Validators.required],
        updateOn: 'submit',
      },
    ],
    start_date: [moment(this.startPeriod).format(this.formatType)],
    end_date: [moment(this.endPeriod).format(this.formatType)],
    language: [this.translate.currentLang],
    timezone_offset: [new Date().getTimezoneOffset()],
    page: 1,
  });

  exportTypeValue: any = {
    range: 1,
    all: 3,
  };

  constructor(
    public activeModal: NgbActiveModal,
    public sharedService: SharedService,
    private patientService: PatientService,
    private translate: TranslateService,
    private toastService: ToastService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {}

  /**
   * handle when close button is clicked
   */
  clickedClose(): void {
    this.activeModal.dismiss();
  }

  /**
   * handle when confirm button is clicked
   */
  clickedExport(): void {
    this.submitted = true;
    setTimeout(() => {
      if (this.groupForm.valid) {
        if (this.patientId) {
          this.downloadPatientDetailCSV();
        } else {
          this.downloadPatientListCSV();
        }
        this.activeModal.close();
      }
    });
  }

  /**
   *download patient detail csv
   * @param page: number
   */
  downloadPatientDetailCSV(page: number = 1) {
    let bodyRequest = JSON.parse(JSON.stringify(this.groupForm.value));
    bodyRequest.page = page;
    bodyRequest.patient_id = this.patientId;
    this.patientService.downloadPatientDetailCSV(bodyRequest).subscribe(
      (response) => {
        let total = response.headers.get('x-total-count');
        let fileName = decodeURIComponent(response.headers.get('content-disposition')!.split('=')[1]);
        fileName = fileName.substring(1, fileName.length - 1);
        downloadZip(fileName, response.body);
        if (page === Number(total)) {
          this.sharedService.showLoadingEventEmitter.emit(false);
        } else {
          this.downloadPatientDetailCSV(page + 1);
        }
      },
      (err) => {
        this.sharedService.showLoadingEventEmitter.emit(false);
        let message = JSON.parse(err.error).message;
        let errMessage = message
          ? message == 'No export data'
            ? this.translate.instant('error.No export data')
            : this.translate.instant(message)
          : this.translate.instant('error.server');
        this.toastService.show(errMessage, { className: 'bg-red-100' });
      }
    );
  }

  /**
   * download patient list csv
   * @param page: number
   */
  downloadPatientListCSV(page: number = 1) {
    let bodyRequest = JSON.parse(JSON.stringify(this.groupForm.value));
    bodyRequest.page = page;
    bodyRequest.group_id = this.groupId;
    bodyRequest.filter = {
      like: {
        id_or_name: this.sharedService.dashboardPatientListSearch,
      },
    };
    this.patientService.downloadPatientListCSV(bodyRequest).subscribe(
      (response) => {
        let total = response.headers.get('x-total-count');
        let fileName = decodeURIComponent(response.headers.get('content-disposition')!.split('=')[1]);
        fileName = fileName.substring(1, fileName.length - 1);
        downloadZip(fileName, response.body);
        if (page === Number(total)) {
          this.sharedService.showLoadingEventEmitter.emit(false);
        } else {
          this.downloadPatientListCSV(page + 1);
        }
      },
      (err) => {
        this.sharedService.showLoadingEventEmitter.emit(false);
        let message = JSON.parse(err.error).message;
        let errMessage = message
          ? message == 'No export data'
            ? this.translate.instant('error.No export data')
            : this.translate.instant(message)
          : this.translate.instant('error.server');
        this.toastService.show(errMessage, { className: 'bg-red-100' });
      }
    );
  }

  get exportTypeField(): any {
    return this.groupForm.get('export_type')!;
  }

  get limitField() {
    return this.groupForm.get('limit')!;
  }

  /**
   * function when export type is changed
   * @param type type input
   */
  changeExportType(type: number) {
    this.exportTypeField.setValue(type);
  }

  /**
   * function when changing start date
   * @param period start input
   */
  chooseStartPeriod(period: Date) {
    this.startPeriod = period;
    this.groupForm.get('start_date')?.setValue(moment(this.startPeriod).format(this.formatType));
  }

  /**
   * function when changing end date
   * @param period end input
   */
  chooseEndPeriod(period: Date) {
    this.endPeriod = period;
    this.groupForm.get('end_date')?.setValue(moment(this.endPeriod).format(this.formatType));
    if (this.startPeriod > this.endPeriod) {
      this.chooseStartPeriod(period);
    }
  }
}
