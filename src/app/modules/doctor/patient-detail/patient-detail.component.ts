import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SharedService } from '@shared/services/shared.service';
import { HospitalService } from '@services/hospital/hospital.service';
import moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmExaminationDateComponent } from '@modules/doctor/patient-detail/left-panel/confirm-examination-date/confirm-examination-date.component';
import { PatientService } from '@services/doctor/patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IPatientBasicInfo } from '@models/patientDetail';
import { BloodPressureTargetModalComponent } from './modals/blood-pressure-target-modal/blood-pressure-target-modal.component';
import { OfficeBloodPressureModalComponent } from './modals/office-blood-pressure-modal/office-blood-pressure-modal.component';
import { RankingHistoryModalComponent } from '@modules/doctor/patient-detail/modals/ranking-history-modal/ranking-history-modal.component';
import { BodyWeightHistoryModalComponent } from '@modules/doctor/patient-detail/modals/body-weight-history-modal/body-weight-history-modal.component';
import { HomeBloodPressureHistoryModalComponent } from './modals/home-blood-pressure-history-modal/home-blood-pressure-history-modal.component';
import { StepCountHistoryModalComponent } from '@modules/doctor/patient-detail/modals/step-count-history-modal/step-count-history-modal.component';
import { OfficeBloodPressureHistoryModalComponent } from '@modules/doctor/patient-detail/modals/office-blood-pressure-history-modal/office-blood-pressure-history-modal.component';
import { ToastService } from '@shared/services/toast.service';
import { PatientProfileComponent } from './modals/patient-profile/patient-profile.component';
import { formatDatetime, joinName, getCountAlertType, getYearDiff } from '@shared/helpers';
import { componentCode, periodOptions } from '@shared/helpers/data';
import { HeartBeatHistoryModalComponent } from '@modules/doctor/patient-detail/modals/heart-beat-history-modal/heart-beat-history-modal.component';
import { MedicalModalComponent } from './modals/medical-modal/medical-modal.component';
import { TemperatureHistoryModalComponent } from '@modules/doctor/patient-detail/modals/temperature-history-modal/temperature-history-modal.component';
import { Subscription } from 'rxjs';
import { PrescriptionComponent } from '@modules/doctor/patient-detail/modals/prescription/prescription.component';
import setting from '@data/json/hospitalSetting.json';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss'],
})
export class PatientDetailComponent implements OnInit, OnDestroy {
  public hospitalSetting: any = {};
  public formatType = 'YYYY-MM-DD';
  chartPeriod = periodOptions.PERIOD_4W;
  rightSideEndDate: string | Date = moment().format(this.formatType);
  rightSideStartDate: string | Date = moment(this.rightSideEndDate)
    .subtract(this.chartPeriod - 1, 'days')
    .format(this.formatType);
  disableNextButton = true;
  timezoneOffset = new Date().getTimezoneOffset();
  public patientId!: string;
  public patient!: IPatientBasicInfo;
  public patientChartData: any;
  public bloodPressureTarget: any = {
    patient_sys_goal: 0,
    patient_dia_goal: 0,
  };
  public bloodPressureChartData: any;
  public bodyTemperatureChartData: any;
  public patientDiaryData: any;
  public patientOtherChartData: any = {};
  public bodyWeightChartData: any = {};
  public heartBeatChartData: any;
  public alertChartData: any;
  public estimatedNYHAChartData: any = {};
  public heartBeatDrugChartData: any = {};
  public prescriptions: any = [];
  public joinName = joinName;
  public hospitalCodeList: Array<string> = [];
  public componentCode = componentCode;
  public closeLeftPanel = false;
  public periodOptions = periodOptions;
  public hospitalOrder: { [k: string]: number } = {};
  public subscriptions: Subscription = new Subscription();
  countAlertType: number = 0;
  public isShowMessageHistory = false;
  public arrIcon = ['help', 'reload', 'back'];

  constructor(
    public sharedService: SharedService,
    private hospitalService: HospitalService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private toastService: ToastService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.sharedService.closeSidebar = true;
    this.sharedService.hospitalSetting = {};
    this.patientId = this.route.snapshot.paramMap.get('id') || '';
    this.getPatientDetail(this.patientId, false);
    this.getHospitalSetting();
    this.subscriptions.add(
      this.sharedService.refreshDataEventEmitter.subscribe(() => {
        this.getLatestData();
      })
    );
  }

  ngOnDestroy() {
    this.sharedService.showLoadingEventEmitter.emit(false);
    this.subscriptions.unsubscribe();
  }

  /**
   * get latest patient detail
   */
  getLatestData() {
    this.sharedService.clickReload = !this.sharedService.clickReload;
    if (this.sharedService.clickReload) {
      this.subscriptions.add(
        this.patientService.getLatestData({ patient_id: this.patientId }).subscribe(
          () => {
            this.sharedService.clickReload = false;
            this.getPatientDetail(this.patientId, false);
            this.getHospitalSetting();
          },
          () => {
            this.sharedService.clickReload = false;
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        )
      );
    }
  }

  /**
   * show/hide sidebar
   */
  clickToggleLeftPanel(): void {
    this.closeLeftPanel = !this.closeLeftPanel;
  }

  /**
   * get api chart follow hospital setting about right panel
   */
  getAPICharts() {
    if (
      this.hospitalCodeList.includes(componentCode.WEIGHT_GRAPH) ||
      this.hospitalCodeList.includes(componentCode.STEP_COUNT_GRAPH)
    ) {
      this.getChartData();
    }
    if (this.hospitalCodeList.includes(componentCode.BLOOD_PRESSURE_PULSE_GRAPH)) {
      this.getBloodPressureChartData();
    }

    if (this.hospitalCodeList.includes(componentCode.BODY_TEMPERATURE_GRAPH)) {
      this.getBodyTemperatureChartData();
    }

    if (this.hospitalCodeList.includes(componentCode.HEARTBEAT_GRAPH)) {
      this.getHeartBeatChartData();
    }

    if (this.hospitalCodeList.includes(componentCode.ALERT_GRAPH) && this.countAlertType) {
      this.getAlertChartData();
    }

    if (this.hospitalCodeList.includes(componentCode.OTHER_GRAPH)) {
      this.getOtherChartData();
    }

    if (this.hospitalCodeList.includes(componentCode.WEIGHT_GRAPH)) {
      this.getBodyWeightChartData();
    }

    if (this.hospitalCodeList.includes(componentCode.BLOOD_PRESSURE_MEDICATION_GRAPH)) {
      this.getListPrescription();
      this.getBPDrugChartData();
    }

    // if (this.hospitalCodeList.includes(componentCode.DIARY_GRAPH)) {
    //   this.getDiaryData();
    // }

    // if (this.hospitalCodeList.includes(componentCode.REVIEW_GRAPH)) {
    //   this.getEstimatedNYHAData();
    // }
  }

  /**
   * get data for blood pressure chart
   */
  getBloodPressureChartData() {
    this.subscriptions.add(
      this.patientService
        .getBloodPressureChartData({
          patient_id: this.patientId,
          start_date: this.rightSideStartDate.toString(),
          end_date: this.rightSideEndDate.toString(),
          timezone_offset: this.timezoneOffset,
        })
        .subscribe(
          (data) => {
            if (data) {
              (Object.values(data) as any[]).map((item: any) => {
                item.vital_office_utc_time = formatDatetime(item.vital_office_utc_time);
                item.medical_register_utc_time = formatDatetime(item.medical_register_utc_time);
              });
              this.bloodPressureChartData = data;
            }
            this.sharedService.showLoadingEventEmitter.emit(false);
          },
          () => {
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        )
    );
  }

  /**
   * get data for body temperature chart
   */
  getBodyTemperatureChartData() {
    this.subscriptions.add(
      this.patientService
        .getBodyTemperatureChartData({
          patient_id: this.patientId,
          start_date: this.rightSideStartDate.toString(),
          end_date: this.rightSideEndDate.toString(),
        })
        .subscribe(
          (data) => {
            this.bodyTemperatureChartData = data;
            this.sharedService.showLoadingEventEmitter.emit(false);
          },
          () => {
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        )
    );
  }

  /**
   * get data for body temperature chart
   */
  getOtherChartData() {
    this.subscriptions.add(
      this.patientService
        .getOtherChartData({
          patient_id: this.patientId,
          start_date: this.rightSideStartDate.toString(),
          end_date: this.rightSideEndDate.toString(),
          timezone_offset: this.timezoneOffset,
        })
        .subscribe(
          (data) => {
            this.patientOtherChartData = data;
            this.sharedService.showLoadingEventEmitter.emit(false);
          },
          () => {
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        )
    );
  }

  /**
   *  get patient detail API (high blood pressure info, heart failure info)
   */
  getPatientDetail(patientId: string, isHideLoading: boolean = true) {
    this.subscriptions.add(
      this.patientService.find({ patient_id: patientId }).subscribe(
        (data) => {
          data.patient_age = getYearDiff(data?.patient_birthday, new Date());
          this.patient = data;
          this.bloodPressureTarget = {
            patient_sys_goal: data.patient_sys_goal || setting.default_hospital_setting_bp.sys_goal,
            patient_dia_goal: data.patient_dia_goal || setting.default_hospital_setting_bp.dia_goal,
          };
          if (isHideLoading) {
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        },
        () => {
          this.router.navigate(['/doctor/patient']);
        }
      )
    );
  }

  /**
   * get all info setting of hospital
   */
  getHospitalSetting() {
    this.subscriptions.add(
      this.hospitalService
        .getHospitalSetting({
          tables: ['hospital_dashboards', 'hospital_threshold_bp', 'hospital_setting', 'hospital_setting_functions'],
        })
        .subscribe(
          (data) => {
            this.countAlertType = getCountAlertType(data?.hospital_setting_functions?.ALERT);
            this.hospitalSetting = data;
            this.sharedService.hospitalSetting = data;
            data.hospital_dashboards.forEach((item: any) => {
              this.hospitalCodeList.push(item.components.component_code);
              this.hospitalOrder[item.components.component_code] = item.hospital_dashboard_order;
            });
            // if hospital setting has some certain component then enable export
            if (
              this.hospitalCodeList.some((el: any) =>
                [
                  componentCode.HOME_MORNING_BLOOD_PRESSURE_7_DAYS,
                  componentCode.HOME_EVENING_BLOOD_PRESSURE_7_DAYS,
                  componentCode.LATEST_OFFICE_BLOOD_PRESSURE,
                ].includes(el)
              )
            ) {
              this.arrIcon.push('export');
            }
            // if hospital doesn't set any graph, so turn off loading
            if (!this.hospitalCodeList.some((component: string) => component.includes('RP'))) {
              this.sharedService.showLoadingEventEmitter.emit(false);
            } else {
              this.getAPICharts();
            }
          },
          () => {
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        )
    );
  }

  /**
   * function to get chart data
   */
  getChartData() {
    this.patientChartData = {};
    this.subscriptions.add(
      this.patientService
        .getChartData({
          patient_id: this.patientId,
          attributes: ['user_stat_weight', 'user_stat_step_count'],
          start_date: moment(this.rightSideStartDate).format(this.formatType),
          end_date: moment(this.rightSideEndDate).format(this.formatType),
        })
        .subscribe(
          (data) => {
            this.patientChartData = data;
            this.sharedService.showLoadingEventEmitter.emit(false);
          },
          () => {
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        )
    );
  }

  /**
   * function to get heart beat chart data
   */
  getHeartBeatChartData() {
    this.heartBeatChartData = {};
    this.subscriptions.add(
      this.patientService
        .getHeartBeatChartData({
          patient_id: this.patientId,
          start_date: moment(this.rightSideStartDate).format(this.formatType),
          end_date: moment(this.rightSideEndDate).format(this.formatType),
          timezone_offset: this.timezoneOffset,
        })
        .subscribe(
          (data) => {
            this.heartBeatChartData = data;
            this.sharedService.showLoadingEventEmitter.emit(false);
          },
          () => {
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        )
    );
  }

  /**
   * function to get heart beat chart data
   */
  getBodyWeightChartData() {
    this.bodyWeightChartData = {};
    this.subscriptions.add(
      this.patientService
        .getBodyWeightChartData({
          patient_id: this.patientId,
          start_date: moment(this.rightSideStartDate).format(this.formatType),
          end_date: moment(this.rightSideEndDate).format(this.formatType),
          timezone_offset: this.timezoneOffset,
        })
        .subscribe(
          (data) => {
            this.bodyWeightChartData = data;
            this.sharedService.showLoadingEventEmitter.emit(false);
          },
          () => {
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        )
    );
  }

  /**
   * get diary chart data
   */
  getDiaryData() {
    this.patientDiaryData = {};
    this.subscriptions.add(
      this.patientService
        .getDiaryChartData({
          patient_id: this.patientId,
          start_date: moment(this.rightSideStartDate).format(this.formatType),
          end_date: moment(this.rightSideEndDate).format(this.formatType),
        })
        .subscribe(
          (data) => {
            this.patientDiaryData = data;
            this.sharedService.showLoadingEventEmitter.emit(false);
          },
          () => {
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        )
    );
  }

  /**
   * get estimated NYHA + review heart failure chart data
   */
  getEstimatedNYHAData() {
    this.estimatedNYHAChartData = {};
    this.subscriptions.add(
      this.patientService
        .getEstimatedNYHAData({
          patient_id: this.patientId,
          start_date: moment(this.rightSideStartDate).format(this.formatType),
          end_date: moment(this.rightSideEndDate).format(this.formatType),
        })
        .subscribe(
          (data) => {
            this.estimatedNYHAChartData = data;
            this.sharedService.showLoadingEventEmitter.emit(false);
          },
          () => {
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        )
    );
  }

  /**
   * get bp drug chart data
   */
  getBPDrugChartData() {
    this.heartBeatDrugChartData = {};
    this.subscriptions.add(
      this.patientService
        .getBPDrugChartData({
          patient_id: this.patientId,
          start_date: moment(this.rightSideStartDate).format(this.formatType),
          end_date: moment(this.rightSideEndDate).format(this.formatType),
        })
        .subscribe(
          (data) => {
            this.heartBeatDrugChartData = data;
            this.sharedService.showLoadingEventEmitter.emit(false);
          },
          () => {
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        )
    );
  }

  /**
   * get list prescription
   */
  getListPrescription() {
    this.prescriptions = [];
    this.subscriptions.add(
      this.patientService
        .getListPrescription({
          patient_id: this.patientId,
          start_date: moment(this.rightSideStartDate).format(this.formatType),
          end_date: moment(this.rightSideEndDate).format(this.formatType),
        })
        .subscribe(
          (data) => {
            this.prescriptions = data;
            this.sharedService.showLoadingEventEmitter.emit(false);
          },
          () => {
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        )
    );
  }

  /**
   * get data for alert chart
   */
  getAlertChartData() {
    this.alertChartData = {};
    this.subscriptions.add(
      this.patientService
        .getAlertChartData({
          patient_id: this.patientId,
          start_date: moment(this.rightSideStartDate).format(this.formatType),
          end_date: moment(this.rightSideEndDate).format(this.formatType),
        })
        .subscribe(
          (data) => {
            this.alertChartData = data;
            this.sharedService.showLoadingEventEmitter.emit(false);
          },
          () => {
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        )
    );
  }

  /**
   * update alert chart when there is update submitted
   * @param update update submitted from chart
   */
  updateAlertChart(update: any) {
    this.subscriptions.add(
      this.patientService
        .updateAlertChart({
          patient_id: this.patientId,
          alert_diary_type: update.alert_diary_type,
          alert_diary_ldate: update.alert_diary_ldate,
          alert_diary_is_confirmed: update.alert_diary_is_confirmed,
          alert_diary_memo: update.alert_diary_memo,
        })
        .subscribe(
          () => {
            this.getAlertChartData();
          },
          (err) => {
            this.getAlertChartData();
            let errMessage = err.error.message ? err.error.message : this.translate.instant('error.server');
            this.toastService.show(errMessage, { className: 'bg-red-100' });
          }
        )
    );
  }

  /**
   * event when click prev button
   */
  clickPrevPeriod() {
    this.rightSideEndDate = moment(this.rightSideEndDate).subtract(this.chartPeriod, 'days').format(this.formatType);
    this.disableNextButton = false;
    this.rightSideStartDate = moment(this.rightSideEndDate)
      .subtract(this.chartPeriod - 1, 'days')
      .format(this.formatType);
    this.getAPICharts();
  }

  /**
   * event when click next button
   */
  clickNextPeriod() {
    if (!this.disableNextButton) {
      this.rightSideEndDate = moment(this.rightSideEndDate).add(this.chartPeriod, 'days').format(this.formatType);
      if (
        moment(this.rightSideEndDate).isSame(new Date(), 'date') ||
        moment(this.rightSideEndDate).isAfter(new Date(), 'date')
      ) {
        this.rightSideEndDate = moment().format(this.formatType);
        this.disableNextButton = true;
      }
      this.rightSideStartDate = moment(this.rightSideEndDate)
        .subtract(this.chartPeriod - 1, 'days')
        .format(this.formatType);
      this.getAPICharts();
    }
  }

  /**
   * function to move back to today on right side
   */
  moveBackToToday() {
    this.rightSideEndDate = moment().format(this.formatType);
    this.rightSideStartDate = moment(this.rightSideEndDate)
      .subtract(this.chartPeriod - 1, 'days')
      .format(this.formatType);
    this.disableNextButton = true;
    this.getAPICharts();
  }

  /**
   * event when click confirm button
   */
  showConfirmExaminationDate() {
    const modalRef = this.modalService.open(ConfirmExaminationDateComponent, {
      backdrop: 'static',
      size: 'lg',
      modalDialogClass: 'w-416',
    });
    modalRef.componentInstance.confirmClicked.subscribe(() => {
      this.subscriptions.add(
        this.patientService
          .confirmMedicalExaminationTime({
            patient_id: this.patientId,
            timezone_offset: this.timezoneOffset,
          })
          .subscribe(
            () => {
              this.sharedService.showLoadingEventEmitter.emit(false);
              this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
            },
            (err: any) => {
              this.sharedService.showLoadingEventEmitter.emit(false);
              let errMessage = err.error.message ? err.error.message : this.translate.instant('error.server');
              this.toastService.show(errMessage, { className: 'bg-red-100' });
            }
          )
      );
    });
  }

  /**
   * open blood pressure target popup
   */
  openBloodPressureTarget() {
    const modalRef = this.modalService.open(BloodPressureTargetModalComponent, {
      backdrop: 'static',
      modalDialogClass: 'w-368',
    });
    modalRef.componentInstance.patient = this.patient;
    modalRef.componentInstance.patientId = this.patientId;
    modalRef.closed.subscribe(() => {
      this.getPatientDetail(this.patientId);
    });
  }

  openOfficeBloodPressureModal() {
    const modalRef = this.modalService.open(OfficeBloodPressureModalComponent, {
      backdrop: 'static',
      modalDialogClass: 'w-368',
    });
    modalRef.componentInstance.patient = this.patient;
    modalRef.componentInstance.hospitalSetting = this.hospitalSetting;
    modalRef.componentInstance.patientId = this.patientId;
    modalRef.closed.subscribe(() => {
      this.getPatientDetail(this.patientId);
      if (this.hospitalCodeList.includes(componentCode.BLOOD_PRESSURE_PULSE_GRAPH)) {
        this.getBloodPressureChartData();
      }
    });
  }
  /**
   * event when click see history button
   */
  showRankingHistory() {
    const modalRef = this.modalService.open(RankingHistoryModalComponent, {
      backdrop: 'static',
      size: 'lg',
      modalDialogClass: 'w-560',
    });
    modalRef.componentInstance.patientId = this.patientId;
    modalRef.componentInstance.hospitalSetting = this.hospitalSetting.hospital_setting;
  }

  /**
   * event when click detail into body weight chart
   */
  showBodyWeightHistory() {
    const modalRef = this.modalService.open(BodyWeightHistoryModalComponent, {
      backdrop: 'static',
      size: 'lg',
      modalDialogClass: 'w-400',
    });
    modalRef.componentInstance.patientId = this.patientId;
  }

  /**
   * event when click detail into home blood pressure chart
   */
  showHomeBloodPressureHistory() {
    const modalRef = this.modalService.open(HomeBloodPressureHistoryModalComponent, {
      backdrop: 'static',
      size: 'lg',
      modalDialogClass: 'w-668',
    });
    modalRef.componentInstance.patientId = this.patientId;
  }

  /**
   * event when click detail into step count chart
   */
  showStepCountHistory() {
    const modalRef = this.modalService.open(StepCountHistoryModalComponent, {
      backdrop: 'static',
      size: 'lg',
      modalDialogClass: 'w-400',
    });
    modalRef.componentInstance.patientId = this.patientId;
  }

  /**
   * event when click edit profile
   */
  editProfile() {
    const modalRef = this.modalService.open(PatientProfileComponent, {
      backdrop: 'static',
      size: 'lg',
      modalDialogClass: 'w-416',
    });
    modalRef.componentInstance.patientId = this.patientId;
    modalRef.componentInstance.allowSyncPatient = this.hospitalCodeList.includes(componentCode.SYNC_PATIENT);
    modalRef.closed.subscribe(() => {
      this.getPatientDetail(this.patientId);
    });
  }

  /**
   * event when click history into latest office blood pressure component
   */
  openOfficeBloodPressureHistoryModal() {
    const modalRef = this.modalService.open(OfficeBloodPressureHistoryModalComponent, {
      size: 'lg',
      backdrop: 'static',
      modalDialogClass: 'w-560',
    });
    modalRef.componentInstance.patientId = this.patientId;
  }

  /**
   * event when click detail into heart beat chart
   */
  showHeartBeatHistory() {
    const modalRef = this.modalService.open(HeartBeatHistoryModalComponent, {
      backdrop: 'static',
      size: 'lg',
      modalDialogClass: 'w-560',
    });
    modalRef.componentInstance.patientId = this.patientId;
    modalRef.componentInstance.patient = this.patient;
  }

  /**
   *
   */
  openMedicalLogic($event: boolean) {
    const modalRef = this.modalService.open(MedicalModalComponent, {
      size: 'lg',
      backdrop: 'static',
      modalDialogClass: 'w-416',
    });
    modalRef.componentInstance.patient = this.patient;
    modalRef.componentInstance.patientId = this.patientId;
    modalRef.componentInstance.isRegister = $event;
    modalRef.closed.subscribe(() => {
      this.getPatientDetail(this.patientId);
    });
  }

  /**
   * event when click detail into temperature chart
   */
  showTemperatureHistory() {
    const modalRef = this.modalService.open(TemperatureHistoryModalComponent, {
      backdrop: 'static',
      size: 'lg',
      modalDialogClass: 'w-400',
    });
    modalRef.componentInstance.patientId = this.patientId;
  }

  /**
   * event happening when period is changed
   */
  onChangePeriod(): void {
    this.rightSideStartDate = new Date(
      new Date(this.rightSideEndDate).getTime() - (this.chartPeriod - 1) * 24 * 60 * 60 * 1000
    );
    this.rightSideStartDate = moment(this.rightSideStartDate).format(this.formatType);
    this.getAPICharts();
  }

  /**
   * handle event when open mailer success or output report success
   */
  handleMailReportSuccess() {
    if (this.hospitalCodeList.includes(componentCode.OTHER_GRAPH)) {
      this.getPatientDetail(this.patientId, false);
      this.getOtherChartData();
    } else {
      this.getPatientDetail(this.patientId, true);
    }
  }

  /**
   * handle event when open/close message button is clicked
   */
  showMessageHistory() {
    this.isShowMessageHistory = !this.isShowMessageHistory;
  }

  /**
   * shinden download report success render data patient detail
   */
  handleShindenDownloadReportSuccess() {
    this.getPatientDetail(this.patientId);
  }

  /**
   * open prescription modal
   */
  showPrescription() {
    const modalRef = this.modalService.open(PrescriptionComponent, {
      backdrop: 'static',
      size: 'lg',
      modalDialogClass: 'w-720',
    });
    modalRef.componentInstance.patientId = this.patientId;
    modalRef.closed.subscribe(() => {
      if (this.hospitalCodeList.includes(componentCode.BLOOD_PRESSURE_MEDICATION_GRAPH)) {
        this.getListPrescription();
      }
    });
  }
}
