import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthenticationService } from '@services/authentication.service';
import { originalFields, bodyRequest, tableColumns } from './data';
import { Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { scrollToTop, handleSortAge, getYearDiff } from '@shared/helpers';
import { DataSyncTimeService } from '@data/services/doctor/data-sync-time.service';
import { Subscription } from 'rxjs';
import { RequestAnalysisDetailComponent } from '@modules/doctor/patient-request-analysis/modals/request-analysis-detail/request-analysis-detail.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShindenService } from '@services/doctor/shinden.service';
import moment from 'moment';
import { ShindenMailComponent } from '@modules/doctor/patient-request-analysis/modals/shinden-mail/shinden-mail.component';
import { PatientMessageModalComponent } from './modals/patient-message-modal/patient-message-modal.component';
import { paymentStatus } from '@shared/helpers/data';
import { PaymentConfirmationComponent } from './modals/payment-confirmation/payment-confirmation.component';
import { PatientService } from '@data/services/doctor/patient.service';
import { HospitalService } from '@data/services/hospital/hospital.service';
import { StorageService } from '@shared/services/storage.service';

@Component({
  selector: 'app-patient-request-analysis',
  templateUrl: './patient-request-analysis.component.html',
  styleUrls: ['./patient-request-analysis.component.scss'],
})
export class PatientRequestAnalysisComponent implements OnInit, OnDestroy {
  public textSearch = '';
  public patientList: any = {
    data: [],
    total: 0,
  };
  public activeSortColumn: string = '';
  public originalFields = originalFields;
  public tableColumns = tableColumns;
  public tableFields: { [key: string]: any } = {};
  public bodyRequest = JSON.parse(JSON.stringify(bodyRequest));
  public latestDataSync!: string;
  public subscriptions: Subscription = new Subscription();
  public now = new Date();
  public clickedPatient: any = {};
  public patientMailList: any = [];
  showShindenMailForm = false;
  public paymentStatus = paymentStatus;
  public isSearching = false;

  constructor(
    public modalService: NgbModal,
    public authService: AuthenticationService,
    public router: Router,
    public sharedService: SharedService,
    private dataSyncTimeService: DataSyncTimeService,
    private shindenService: ShindenService,
    public patientService: PatientService,
    public hospitalService: HospitalService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.tableFields = JSON.parse(JSON.stringify(this.originalFields));
    this.subscriptions.add(
      this.hospitalService
        .getHospitalSetting({
          tables: ['hospital_dashboards', 'hospital_setting', 'hospital_setting_functions'],
        })
        .subscribe(
          (data: any) => {
            this.sharedService.hospitalSetting = data;
            if (this.sharedService.hospitalSetting.hospital_setting.hospital_setting_shinden_report) {
              this.getLatestDataSync();
              this.getPatientList();
              this.showShindenMailForm = false;
            } else {
              this.router.navigate(['/doctor/page-not-found']);
            }
          },
          () => {
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        )
    );
    if (this.storageService.getFromSession('shindenParams')) {
      let storageParam = this.storageService.getFromSession('shindenParams');
      this.bodyRequest = storageParam;
      this.textSearch = this.bodyRequest.filter.like.id_or_name;
      if (storageParam.sort) {
        this.activeSortColumn = Object.keys(this.tableFields).find(
          (key: any) => this.tableFields[key].field === storageParam.sort.attribute
        )!;
        this.tableFields[this.activeSortColumn].isSort = true;
        this.tableFields[this.activeSortColumn].sortType = ['patient_birthday', 'patient_analysis_status'].includes(
          this.activeSortColumn
        )
          ? this.handleSortAge(storageParam.sort.type)
          : storageParam.sort.type;
      } else {
        this.setDefaultSort();
      }
    } else this.setDefaultSort();
  }

  /**
   * set default sort
   */
  setDefaultSort() {
    this.activeSortColumn = 'patient_analysis_status';
    this.tableFields[this.activeSortColumn].isSort = true;
    this.tableFields[this.activeSortColumn].sortType = 'asc';
    this.bodyRequest.sort = {
      attribute: this.tableFields[this.activeSortColumn].field,
      type: this.handleSortAge(this.tableFields[this.activeSortColumn].sortType),
    };
  }

  ngOnDestroy() {
    this.sharedService.showLoadingEventEmitter.emit(false);
    this.storageService.removeFromSession('shindenParams');
    this.subscriptions.unsubscribe();
  }

  /**
   * get latest data sync
   */
  getLatestDataSync() {
    this.subscriptions.add(
      this.dataSyncTimeService.getLatestDataSync().subscribe(
        (data) => {
          this.latestDataSync = data.updated_at;
        },
        () => {
          this.sharedService.showLoadingEventEmitter.emit(false);
        }
      )
    );
  }

  /**
   * get patient list information with pagination
   */
  getPatientList() {
    scrollToTop('table-content');
    this.subscriptions.add(
      this.shindenService.getPatientAnalysisRequestList(this.bodyRequest).subscribe(
        (data: any) => {
          this.patientList = data;
          this.now = new Date();
          this.storageService.setToSession('shindenParams', this.bodyRequest);
          this.sharedService.showLoadingEventEmitter.emit(false);
          this.isSearching = false;
        },
        () => {
          this.sharedService.showLoadingEventEmitter.emit(false);
          this.isSearching = false;
        }
      )
    );
  }

  /**
   * handle when search icon is clicked or enter input
   */
  searchPatient() {
    this.isSearching = true;
    this.bodyRequest.page = 1;
    this.bodyRequest.filter.like.id_or_name = this.textSearch;
    this.getPatientList();
  }

  /**
   * Handle sorting function
   * @param data: data emit when clicking sort
   */
  sortBy(data: any): void {
    this.activeSortColumn = data.label_id;

    if (!this.tableFields[this.activeSortColumn].isSort) {
      this.tableFields = JSON.parse(JSON.stringify(this.originalFields));
      this.tableFields[this.activeSortColumn].isSort = true;
    }
    if (this.tableFields[this.activeSortColumn].sortType === 'asc') {
      this.tableFields[this.activeSortColumn].sortType = 'desc';
    } else if (this.tableFields[this.activeSortColumn].sortType === 'desc') {
      this.tableFields[this.activeSortColumn].sortType = '';
    } else {
      this.tableFields[this.activeSortColumn].sortType = 'asc';
    }
    this.bodyRequest.sort = {
      attribute: this.tableFields[this.activeSortColumn].sortType ? this.tableFields[this.activeSortColumn].field : '',
      type: ['patient_birthday', 'patient_analysis_status'].includes(this.activeSortColumn)
        ? this.handleSortAge(this.tableFields[this.activeSortColumn].sortType)
        : this.tableFields[this.activeSortColumn].sortType,
    };

    this.getPatientList();
  }

  public pageChange(data?: any): void {
    if (data) {
      this.bodyRequest.limit = data.perPage;
      this.bodyRequest.page = data.page;
    }
    this.getPatientList();
  }

  /**
   * redirect to patient detail page
   *
   * @param patientId - uuid of patient
   */
  redirectPatientDetail(patientId: string): void {
    this.router.navigate([`/doctor/patient/${patientId}`]);
  }

  /**
   * handle sort patient follow birthday
   * @param sortType - string type asc | desc | ''
   */
  public handleSortAge(sortType: string): string {
    return handleSortAge(sortType);
  }

  /**
   * show patient message modal
   * @param message message content
   */
  openMessage(message: any) {
    const modalRef = this.modalService.open(PatientMessageModalComponent, {
      backdrop: 'static',
      size: 'lg',
      modalDialogClass: 'w-640',
    });
    modalRef.componentInstance.message = message;
  }

  /**
   * show modal shinden mail
   */
  shindenEmail(patient: any, isCreate: boolean, email: any) {
    if (patient?.patient_analysis_status) {
      if (email) {
        if (!isCreate) {
          this.showShindenMailForm = false;
          const modalRef = this.modalService.open(ShindenMailComponent, {
            backdrop: 'static',
            size: 'lg',
            modalDialogClass: 'w-720',
          });
          modalRef.componentInstance.patient = patient;
        } else {
          this.showShindenMailForm = true;
          this.clickedPatient = patient;
        }
      }
    }
  }

  closeModal(data: any): void {
    this.showShindenMailForm = false;
    if (this.patientMailList.length) {
      for (let i = 0; i < this.patientMailList.length; i++) {
        if (this.patientMailList[i].patientAnalysisId == data.patientAnalysisId) {
          this.patientMailList.splice(i, 1);
        }
      }
    }
    if (!data.submit) {
      this.patientMailList.push(data);
    } else {
      this.getPatientList();
      this.getPatientBadgeNotification();
    }
  }

  /**
   * show modal detail request Analysis Detail
   */
  requestAnalysisDetail(patient: any) {
    this.showShindenMailForm = false;
    const modalRef = this.modalService.open(RequestAnalysisDetailComponent, {
      backdrop: 'static',
      size: 'lg',
      modalDialogClass: 'w-845 mt-80',
    });
    modalRef.componentInstance.patient = patient;
  }

  /**
   * show modal detail request Analysis Detail
   */
  confirmPayment(patient: any, isCancel: boolean = false) {
    const modalRef = this.modalService.open(PaymentConfirmationComponent, {
      backdrop: 'static',
      size: 'lg',
      modalDialogClass: 'w-416 mt-80',
    });
    modalRef.componentInstance.isCancel = isCancel;
    modalRef.componentInstance.patient = patient;
    modalRef.closed.subscribe(() => {
      this.getPatientList();
      this.getPatientBadgeNotification();
    });
  }

  getPatientBadgeNotification() {
    this.patientService.getPatientBadgeNotification({}).subscribe(
      (data: any) => {
        this.sharedService.totalPatientHasAlert = data.alert_count || 0;
        this.sharedService.totalPatientAnalysisRequest = data.analysis_count || 0;
      },
      () => {
        this.sharedService.showLoadingEventEmitter.emit(false);
      }
    );
  }

  getYearDiff(startDate: Date | string, endDate: Date | string): number | string {
    return getYearDiff(startDate, endDate);
  }

  /**
   * Calculating the difference in two dates in months and remaining days.
   * @param startDate
   * @param endDate
   */
  calcTime(startDate: Date | string, endDate: Date | string): string {
    if (!startDate || !endDate) return '';
    const date1 = moment(new Date(startDate), 'YYYY-MM-DD HH:mm:ss');
    const date2 = moment(new Date(endDate), 'YYYY-MM-DD HH:mm:ss');
    const m3 = date2.diff(date1, 'minutes');
    const numDays = Math.floor(m3 / 1440);
    const numHours = Math.floor((m3 % 1440) / 60);
    const numMinutes = Math.floor((m3 % 1440) % 60);

    return this.sharedService.isJa()
      ? numDays + '日' + numHours + '時問' + numMinutes + '分'
      : numDays + 'd ' + numHours + 'h ' + numMinutes + 'm';
  }
}
