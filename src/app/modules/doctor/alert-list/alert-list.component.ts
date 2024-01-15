import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthenticationService } from '@services/authentication.service';
import { originalFields, bodyRequest } from './data';
import { PatientService } from '@services/doctor/patient.service';
import { Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { scrollToTop, joinName, getDiffDate, getPluralNoun, getYearDiff } from '@shared/helpers';
import { HospitalService } from '@data/services/hospital/hospital.service';
import { alertNewStatus, alertType } from '@shared/helpers/data';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { fixNumber } from '@shared/helpers';
import { StorageService } from '@shared/services/storage.service';

@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.scss'],
})
export class AlertListComponent implements OnInit, OnDestroy {
  public textSearch = '';
  public alertList: any = {
    data: [],
    total: 0,
  };
  public activeSortColumn: string = '';

  public originalFields = originalFields;
  public tableFields: { [key: string]: any } = {};
  public bodyRequest = JSON.parse(JSON.stringify(bodyRequest));
  public joinName = joinName;
  public now = new Date();
  public alertNewStatus = alertNewStatus;
  public alertType = alertType;
  public subscriptions: Subscription = new Subscription();
  public alertTooltip: string = '';
  public isSearching = false;

  constructor(
    public authService: AuthenticationService,
    public patientService: PatientService,
    public router: Router,
    public sharedService: SharedService,
    private hospitalService: HospitalService,
    public translate: TranslateService,
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
            this.alertTooltip = this.handleAlertTooltip(data);
            if (this.sharedService.hospitalSetting.hospital_setting.hospital_setting_alert_function) {
              this.getAlertList();
            } else {
              this.router.navigate(['/doctor/page-not-found']);
            }
          },
          () => {
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        )
    );
    if (this.storageService.getFromSession('alertParams')) {
      let storageParam = this.storageService.getFromSession('alertParams');
      this.bodyRequest = storageParam;
      this.textSearch = this.bodyRequest.filter.like.id_or_name;
      if (storageParam.sort) {
        this.activeSortColumn = storageParam.sort.attribute;
        if (!this.tableFields[this.activeSortColumn].isSort) {
          this.tableFields[this.activeSortColumn].isSort = true;
        }
        this.tableFields[this.activeSortColumn].sortType = storageParam.sort.type;
      }
    }
  }

  ngOnDestroy() {
    this.sharedService.showLoadingEventEmitter.emit(false);
    this.storageService.removeFromSession('alertParams');
    this.subscriptions.unsubscribe();
  }

  /**
   * get patient list information with pagination
   */
  getAlertList() {
    scrollToTop('table-content');
    this.subscriptions.add(
      this.patientService.getAlertList(this.bodyRequest).subscribe(
        (data: any) => {
          this.alertList = data;
          this.sharedService.showLoadingEventEmitter.emit(false);
          this.storageService.setToSession('alertParams', this.bodyRequest);
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
    this.bodyRequest.filter.like.id_or_name = this.textSearch.trim();
    this.getAlertList();
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

    // sort.type is required => set default value is asc if attribute = ''
    this.bodyRequest.sort = {
      attribute: this.tableFields[this.activeSortColumn].sortType ? this.tableFields[this.activeSortColumn].field : '',
      type: this.tableFields[this.activeSortColumn].sortType || 'asc',
    };
    this.getAlertList();
  }

  public pageChange(data?: any): void {
    if (data) {
      this.bodyRequest.limit = data.perPage;
      this.bodyRequest.page = data.page;
    }
    this.getAlertList();
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
   * take numberFix digit after comma
   * @param value - value need handle
   * @param numberFix -
   */
  public fixNumber(value: number, numberFix: number = 1): string {
    return fixNumber(value, numberFix);
  }

  /**
   * get day diff between two dates
   * @param startDate
   * @param endDate
   * @param type
   */
  public getDiffDate(startDate: Date | string, endDate: Date | string, type?: any): number | string {
    return getDiffDate(startDate, endDate, type);
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
   * handle tooltip follow hospital setting alert function
   */
  handleAlertTooltip(data: any): string {
    let newAlertTooltip = this.translate.instant('new alert');
    let tooltipArr = [];
    const alertFunc = data?.hospital_setting_functions?.ALERT;

    if (alertFunc && alertFunc?.WEIGHT?.hospital_setting_function_status) {
      tooltipArr.push(`${this.translate.instant('patient detail.body weight')}`);
    }
    if (alertFunc && alertFunc?.BP?.hospital_setting_function_status) {
      tooltipArr.push(`${this.translate.instant('patient.blood pressure')}`);
    }
    if (alertFunc && alertFunc?.AF?.hospital_setting_function_status) {
      tooltipArr.push(`${this.translate.instant('af')}`);
    }
    if (alertFunc && alertFunc?.IHB?.hospital_setting_function_status) {
      tooltipArr.push(`${this.translate.instant('IHB')}`);
    }

    return tooltipArr.length ? `${newAlertTooltip} (${tooltipArr.join('/')}) ` : `${newAlertTooltip}`;
  }

  getYearDiff(startDate: Date | string, endDate: Date | string): number | string {
    return getYearDiff(startDate, endDate);
  }
}
