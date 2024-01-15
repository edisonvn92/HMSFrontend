import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingAlertModalComponent } from '@modules/doctor/patient-detail/modals/setting-alert-modal/setting-alert-modal.component';
import { DetailLatestAlertModalComponent } from '@modules/doctor/patient-detail/modals/detail-latest-alert-modal/detail-latest-alert-modal.component';
import { PatientService } from '@data/services/doctor/patient.service';
import { IPatientBasicInfo } from '@data/models/patientDetail';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { fixNumber, getPluralNoun, getCountAlertType } from '@shared/helpers';
import { alertNewStatus, alertNewType, alertType } from '@shared/helpers/data';

@Component({
  selector: 'app-latest-alert',
  templateUrl: './latest-alert.component.html',
  styleUrls: ['./latest-alert.component.scss'],
})
export class LatestAlertComponent implements OnInit {
  @Input() patientId!: string;

  patient: IPatientBasicInfo | any = {};
  alertNewStatus = alertNewStatus;
  alertType = alertType;
  tempDetailAlert: any = [];
  redVerticalBarHeight: number = 72;
  countAlertType: number = 0;
  public detailAlert: any = {
    alert_history_afs: [],
    alert_history_bps: [],
    alert_history_weights: [],
    alert_history_ihbs: [],
    alert_history_memo: null,
    alert_new_status_updated_at: null,
    alert_new_status: null,
  };

  public list_alert_new_id: Array<number> = [];

  public listAlertCancel: any = {
    data: [],
    per_page: 5,
    total: 0,
  };

  public bodyRequest = {
    limit: 5,
    page: 1,
    total: 0,
  };

  constructor(
    public modalService: NgbModal,
    public patientService: PatientService,
    public sharedService: SharedService,
    public toastService: ToastService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.getListAlertCancel();
    this.getDetailAlert();
    this.countAlertType = getCountAlertType(this.sharedService.hospitalSetting?.hospital_setting_functions?.ALERT);
    this.redVerticalBarHeight = this.countAlertType > 0 ? this.countAlertType * (72 + 8) - 8 : 0;
  }

  /**
   * handle when page changed
   * @param data
   */
  public pageChange(data?: any): void {
    if (data) {
      this.bodyRequest.page = data.page;
    }
    this.getListAlertCancel(true);
  }

  /**
   * get list alert cancel
   * @returns
   * @param isLoading
   */
  getListAlertCancel(isLoading: boolean = false) {
    this.patientService
      .getListAlertCancel({
        patient_id: this.patientId,
        page: this.bodyRequest.page,
        limit: this.bodyRequest.limit,
      })
      .subscribe(
        (data) => {
          this.listAlertCancel = data;
          if (isLoading) {
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        },
        (err) => {
          this.sharedService.showLoadingEventEmitter.emit(false);
          let errMessage = err.error.message ? err.error.message : this.translate.instant('error.server');
          this.toastService.show(errMessage, { className: 'bg-red-100' });
        }
      );
  }

  /**
   * get detail alert
   */
  getDetailAlert() {
    this.patientService
      .getDetailAlert({
        patient_id: this.patientId,
      })
      .subscribe(
        (data) => {
          this.tempDetailAlert = [];
          this.detailAlert = {
            alert_history_afs: [],
            alert_history_bps: [],
            alert_history_weights: [],
            alert_history_ihbs: [],
            alert_history_ihb_memo: null,
            alert_new_status_updated_at: null,
            alert_new_status: null,
          };
          this.list_alert_new_id = [];
          this.sharedService.showLoadingEventEmitter.emit(false);
          if (data && data.length) {
            for (let item of data) {
              this.list_alert_new_id.push(item.alert_new_id);
              switch (item.alert_new_type) {
                case alertNewType.WEIGHT:
                  const weight = {
                    alert_history_weight_vital_utc_time: item.alert_new_vital_utc_time,
                    alert_history_weight_ratio: item.alert_new_weight_ratio,
                    alert_history_weight_days: item.alert_new_weight_days,
                    alert_new_status: item.alert_new_status,
                    alert_history_weight_memo: item.alert_new_memo,
                    alert_history_weight_type: item.alert_new_weight_type,
                  };
                  if (
                    this.sharedService.hospitalSetting?.hospital_setting_functions?.ALERT?.WEIGHT
                      ?.hospital_setting_function_status
                  ) {
                    this.tempDetailAlert.push(item);
                    this.detailAlert.alert_history_weights.push(weight);
                  }
                  break;
                case alertNewType.BP:
                  const bp = {
                    alert_history_bp_vital_utc_time: item.alert_new_vital_utc_time,
                    alert_history_bp_sys: item.alert_new_bp_sys,
                    alert_history_bp_dia: item.alert_new_bp_dia,
                    alert_new_status: item.alert_new_status,
                    alert_history_bp_memo: item.alert_new_memo,
                    alert_history_bp_type: item.alert_new_bp_type,
                  };
                  if (
                    this.sharedService.hospitalSetting?.hospital_setting_functions?.ALERT?.BP
                      ?.hospital_setting_function_status
                  ) {
                    this.tempDetailAlert.push(item);
                    this.detailAlert.alert_history_bps.push(bp);
                  }
                  break;
                case alertNewType.IHB:
                  const ihb = {
                    alert_history_ihb_vital_utc_time: item.alert_new_vital_utc_time,
                    alert_history_ihb_times: item.alert_new_ihb_times,
                    alert_history_ihb_days: item.alert_new_ihb_days,
                    alert_new_status: item.alert_new_status,
                    alert_history_ihb_memo: item.alert_new_memo,
                    alert_history_ihb_type: item.alert_new_ihb_type,
                  };
                  if (
                    this.sharedService.hospitalSetting?.hospital_setting_functions?.ALERT?.IHB
                      ?.hospital_setting_function_status
                  ) {
                    this.tempDetailAlert.push(item);
                    this.detailAlert.alert_history_ihbs.push(ihb);
                  }
                  break;
                case alertNewType.AF:
                  const af = {
                    alert_history_af_times: item.alert_new_af_times,
                    alert_history_af_days: item.alert_new_af_days,
                    alert_history_af_vital_utc_time: item.alert_new_vital_utc_time,
                    alert_new_status: item.alert_new_status,
                    alert_history_af_memo: item.alert_new_memo,
                    alert_history_af_type: item.alert_new_af_type,
                  };
                  if (
                    this.sharedService.hospitalSetting?.hospital_setting_functions?.ALERT?.AF
                      ?.hospital_setting_function_status
                  ) {
                    this.tempDetailAlert.push(item);
                    this.detailAlert.alert_history_afs.push(af);
                  }
                  break;
              }
            }
            // sort desc follow alert_new_status_updated_at
            this.tempDetailAlert = this.tempDetailAlert.sort((a: any, b: any) => {
              if (a.alert_new_status_updated_at < b.alert_new_status_updated_at) return 1;
              if (a.alert_new_status_updated_at > b.alert_new_status_updated_at) return -1;
              return 0;
            });

            this.detailAlert.alert_new_status = this.getStatusConfirm() ? alertNewStatus.SEEN : alertNewStatus.UNSEEN;
            if (this.tempDetailAlert.length && this.tempDetailAlert[0].alert_new_status_updated_at) {
              this.detailAlert.alert_new_status_updated_at = this.tempDetailAlert[0].alert_new_status_updated_at;
            } else this.detailAlert.alert_new_status_updated_at = this.getLatestTime(this.detailAlert);
          } else
            this.detailAlert = {
              alert_history_afs: [],
              alert_history_bps: [],
              alert_history_weights: [],
              alert_history_ihbs: [],
            };
        },
        (err) => {
          this.sharedService.showLoadingEventEmitter.emit(false);
          let errMessage = err.error.message ? err.error.message : this.translate.instant('error.server');
          this.toastService.show(errMessage, { className: 'bg-red-100' });
        }
      );
  }

  /**
   * open alert setting modal when button setting is clicked
   */
  openAlertSetting() {
    const modalRef = this.modalService.open(SettingAlertModalComponent, {
      backdrop: 'static',
      size: 'lg',
      modalDialogClass: this.sharedService.isJa() ? 'w-1080' : 'w-1165',
    });

    modalRef.componentInstance.patientId = this.patientId;
  }

  /**
   * open modal when button setail is clicked
   */
  openLatestAlertDetail() {
    if (!this.disableDetailButton()) {
      const modalRef = this.modalService.open(DetailLatestAlertModalComponent, {
        backdrop: 'static',
        size: 'lg',
        modalDialogClass: 'w-464',
      });
      modalRef.componentInstance.isDetail = false;
      modalRef.componentInstance.patient_id = this.patientId;
      modalRef.componentInstance.dataChild = this.detailAlert;
      modalRef.closed.subscribe(() => {
        this.getDetailAlert();
        this.getListAlertCancel();
      });
      modalRef.componentInstance.memo = this.getMemo(this.detailAlert);
      modalRef.componentInstance.list_alert_new_id = this.list_alert_new_id;
    }
  }

  /**
   * open modal when button detail is clicked
   */
  openAlertDetail(data: any) {
    const modalRef = this.modalService.open(DetailLatestAlertModalComponent, {
      backdrop: 'static',
      size: 'lg',
      modalDialogClass: 'w-464',
    });
    modalRef.componentInstance.isDetail = true;
    modalRef.componentInstance.dataChild = data;
    modalRef.componentInstance.memo = this.getMemo(data);
  }

  /**
   * take numberFix digit after comma
   *
   * @param value - value need handle
   * @param numberFix -
   */
  public fixNumber(value: number, numberFix: number = 1): string {
    return fixNumber(value, numberFix);
  }

  /**
   * get memo text
   */
  getMemo(data: any): string {
    let record = '';
    Object.keys(data).forEach((key: string) => {
      if (Array.isArray(data[key]) && data[key].length && !record) {
        record = data[key][0][key.slice(0, -1) + '_memo'];
      }
    });
    return record;
  }

  /**
   * Check disable detail button
   */
  disableDetailButton() {
    return (
      (this.sharedService.hospitalSetting?.hospital_setting_functions?.ALERT?.WEIGHT
        ?.hospital_setting_function_status &&
        !this.detailAlert.alert_history_weights.length) ||
      (this.sharedService.hospitalSetting?.hospital_setting_functions?.ALERT?.BP?.hospital_setting_function_status &&
        !this.detailAlert.alert_history_bps.length) ||
      (this.sharedService.hospitalSetting?.hospital_setting_functions?.ALERT?.AF?.hospital_setting_function_status &&
        !this.detailAlert.alert_history_afs.length) ||
      (this.sharedService.hospitalSetting?.hospital_setting_functions?.ALERT?.IHB?.hospital_setting_function_status &&
        !this.detailAlert.alert_history_ihbs.length)
    );
  }

  /**
   * get latestTime
   */
  getLatestTime(data: any): string {
    let latestTime = '';
    Object.keys(data).forEach((key: string) => {
      if (
        Array.isArray(data[key]) &&
        data[key].length &&
        data[key][0].alert_new_status === alertNewStatus.SEEN &&
        !latestTime
      ) {
        latestTime = data[key][0][key.slice(0, -1) + '_vital_utc_time'];
      }
    });
    return latestTime;
  }

  /**
   * get text noun in en language
   * @param singularNoun
   * @param pluralNoun
   * @param value
   * @param textJa
   * @returns
   */
  getPluralNoun(singularNoun: string, pluralNoun: string, value: number, textJa: string): string {
    if (this.sharedService.isJa()) return this.translate.instant(textJa);
    return getPluralNoun(this.translate.instant(singularNoun), this.translate.instant(pluralNoun), value);
  }

  /**
   * get Index of Array AlertNew
   */
  getIndexArray(data: string, arrName: string): number {
    if (this.detailAlert[data].length > 1) {
      let proPerTime = 'alert_history_' + arrName + '_vital_utc_time';
      let proPerType = 'alert_history_' + arrName + '_type';
      if (
        this.detailAlert[data][0][proPerTime] === this.detailAlert[data][1][proPerTime] &&
        this.detailAlert[data][0][proPerType] === alertType.TYPE2
      )
        return 1;
    }
    return 0;
  }

  /**
   * get Status confirm of alert
   */
  getStatusConfirm() {
    if (this.detailAlert.alert_history_afs.find((item: any) => item.alert_new_status === alertNewStatus.SEEN))
      return true;
    if (this.detailAlert.alert_history_bps.find((item: any) => item.alert_new_status === alertNewStatus.SEEN))
      return true;
    if (this.detailAlert.alert_history_ihbs.find((item: any) => item.alert_new_status === alertNewStatus.SEEN))
      return true;
    return !!this.detailAlert.alert_history_weights.find((item: any) => item.alert_new_status === alertNewStatus.SEEN);
  }
}
