import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { ChangeGroupComponent } from '@modules/doctor/patient-list/change-group/change-group.component';
import { componentCode, componentType } from '@shared/helpers/data';
import { AuthenticationService } from '@services/authentication.service';
import { ILoginUser } from '@models/loginUser';
import { originalFields, tooltipNYHAList, bodyRequest } from './data';
import { PatientService } from '@services/doctor/patient.service';
import { Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { HospitalService } from '@services/hospital/hospital.service';
import {
  getBackgroundColorFollowLevel,
  getRiskLevel,
  getSysBloodPressureFollowLevel,
  getDiaBloodPressureFollowLevel,
  scrollToTop,
  joinName,
  getLevelNYHA,
  handleSortAge,
  getDiffDate,
} from '@shared/helpers';
import { DataSyncTimeService } from '@data/services/doctor/data-sync-time.service';
import { Subscription } from 'rxjs';
import { fixNumber } from '@shared/helpers';
import { StorageService } from '@shared/services/storage.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
})
export class PatientListComponent implements OnInit, OnDestroy {
  public selectedGroupId = -1;
  public groupList: { group_id: number; group_name: string }[] = [];
  public textSearch = '';
  public patientList: any = {
    data: [],
    total: 0,
  };
  public activeSortColumn: string = '';

  public tooltipNYHAList = tooltipNYHAList;
  public originalFields = originalFields;
  public tableFields: { [key: string]: any } = {};
  public bodyRequest = JSON.parse(JSON.stringify(bodyRequest));
  public componentCode = componentCode;
  public hospitalSetting: any = {
    hospital_dashboards: [],
  };
  public hospitalCodeList: Array<string> = [];
  public joinName = joinName;
  public firstComponentCode: string | undefined = '';
  public lastComponentCode: string = '';
  public latestDataSync!: string;
  public subscriptions: Subscription = new Subscription();
  public now = new Date();
  public isSearching = false;

  constructor(
    private modalService: NgbModal,
    public authService: AuthenticationService,
    public patientService: PatientService,
    public router: Router,
    public sharedService: SharedService,
    private hospitalService: HospitalService,
    private dataSyncTimeService: DataSyncTimeService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    const authInfo = this.authService.getCurrentUserInfo();
    if (!authInfo) {
      this.sharedService.showLoadingEventEmitter.emit(false);
      this.subscriptions.add(
        this.authService.getCurrentUser().subscribe((user: ILoginUser) => {
          this.groupList = user.groups;
          this.selectedGroupId =
            this.sharedService.selectedGroupId || (user.groups.length > 0 ? user.groups[0].group_id : 0);
          this.bodyRequest.groups = [this.selectedGroupId];
        })
      );
    } else {
      this.groupList = authInfo?.groups || [];
      this.selectedGroupId =
        this.sharedService.selectedGroupId || (this.groupList.length > 0 ? this.groupList[0].group_id : 0);
      this.bodyRequest.groups = [this.selectedGroupId];
    }

    if (this.storageService.getFromSession('patientParams')) {
      let storageParam = this.storageService.getFromSession('patientParams');
      this.bodyRequest = storageParam;
      this.textSearch = this.bodyRequest.filter.like.id_or_name;
      this.sharedService.dashboardPatientListSearch = this.textSearch;
      this.selectedGroupId = storageParam.groups[0];
    }
    this.sharedService.selectedGroupId = this.selectedGroupId;
    this.getHospitalSetting();
    this.getLatestDataSync();
  }

  ngOnDestroy() {
    this.sharedService.showLoadingEventEmitter.emit(false);
    this.sharedService.dashboardPatientListSearch = '';
    this.storageService.removeFromSession('patientParams');
    this.subscriptions.unsubscribe();
  }

  /**
   * get all info setting of hospital
   */
  getHospitalSetting() {
    this.tableFields = JSON.parse(JSON.stringify(this.originalFields));
    this.subscriptions.add(
      this.hospitalService
        .getHospitalSetting({
          tables: ['hospital_dashboards', 'hospital_setting', 'hospital_setting_functions'],
        })
        .subscribe(
          (data) => {
            this.handleDataHospitalSetting(data);
          },
          () => {
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        )
    );
  }

  /**
   * handle data hospital setting
   * @param data : hospital setting data
   */
  handleDataHospitalSetting(data: any) {
    data.hospital_dashboards =
      data.hospital_dashboards && data.hospital_dashboards.length > 0
        ? data.hospital_dashboards.sort((a: any, b: any) => a.hospital_dashboard_order - b.hospital_dashboard_order)
        : [];
    this.hospitalSetting = data;
    this.sharedService.hospitalSetting = data;
    data.hospital_dashboards.forEach((item: any) => {
      if (item.components?.component_type === componentType.LIST) {
        this.hospitalCodeList.push(item.components.component_code);
      }
    });
    this.lastComponentCode =
      this.hospitalCodeList.length > 0 ? this.hospitalCodeList[this.hospitalCodeList.length - 1] : '';
    let storageParam = this.storageService.getFromSession('patientParams');
    if (storageParam && storageParam.sort) {
      // get sort param from storage
      let activeColumn = this.hospitalCodeList.find(
        (item) =>
          Object.keys(originalFields).includes(item) &&
          (originalFields as any)[item].field === storageParam.sort.attribute
      );
      if (activeColumn) {
        this.activeSortColumn = activeColumn;
        this.tableFields[this.activeSortColumn].isSort = true;
        this.tableFields[this.activeSortColumn].sortType =
          activeColumn === componentCode.AGE ? this.handleSortAge(storageParam.sort.type) : storageParam.sort.type;
        this.bodyRequest.sort.attribute = this.tableFields[this.activeSortColumn].field;
        this.bodyRequest.sort.type = storageParam.sort.type;
      }
    } else {
      this.firstComponentCode = this.hospitalCodeList.find((item) => Object.keys(originalFields).includes(item));
      let firstColumn = this.firstComponentCode ? this.tableFields[this.firstComponentCode] : null;
      if (firstColumn) {
        this.activeSortColumn = firstColumn.componentCode;
        this.tableFields[this.activeSortColumn].isSort = true;
        this.tableFields[this.activeSortColumn].sortType = 'asc';
        this.bodyRequest.sort.attribute = this.tableFields[this.activeSortColumn].field;
        this.bodyRequest.sort.type =
          firstColumn.componentCode === componentCode.AGE
            ? this.handleSortAge('asc')
            : this.tableFields[this.activeSortColumn].sortType;
      }
    }
    this.getPatientList();
  }

  /**
   * get patient list information with pagination
   */
  getPatientList() {
    scrollToTop('table-content');
    this.subscriptions.add(
      this.patientService.getPatientList(this.bodyRequest).subscribe(
        (data) => {
          this.patientList = data;
          this.sharedService.showLoadingEventEmitter.emit(false);
          this.storageService.setToSession('patientParams', this.bodyRequest);
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
   * handle when group is clicked
   */
  clickGroupName(): void {
    const modalRef = this.modalService.open(ChangeGroupComponent, {
      backdrop: 'static',
      size: 'lg',
      modalDialogClass: 'w-560',
    } as NgbModalOptions);
    modalRef.componentInstance.groupList = this.groupList;
    modalRef.componentInstance.selectedGroup = this.selectedGroupId;
    modalRef.componentInstance.emittedGroup.subscribe((result: number) => {
      this.selectedGroupId = result;
      this.sharedService.selectedGroupId = this.selectedGroupId;
      // fetch patient list follow selected group
      this.textSearch = '';
      this.sharedService.dashboardPatientListSearch = this.textSearch;
      this.bodyRequest.page = 1;
      this.bodyRequest.filter.like.id_or_name = '';
      this.bodyRequest.groups = [result];
      this.getPatientList();
    });
  }

  /**
   * handle when search icon is clicked or enter input
   */
  searchPatient() {
    this.isSearching = true;
    this.bodyRequest.page = 1;
    this.bodyRequest.filter.like.id_or_name = this.textSearch.trim();
    this.sharedService.dashboardPatientListSearch = this.textSearch;
    this.bodyRequest.groups = [this.selectedGroupId];
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
      type: ([componentCode.AGE, componentCode.FINAL_MEDICAL_TREATMENT] as Array<string>).includes(
        this.activeSortColumn
      )
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
   * get background color follow level
   *
   * @param level - include L | M | MH | H
   */
  public getBackgroundColorFollowLevel(level: string): string {
    return getBackgroundColorFollowLevel(level);
  }

  /**
   * Get level blood pressure follow sys and dia
   *
   * @param sysBloodPressure - number type
   * @param diaBloodPressure - number type
   */
  public getRiskLevel(sysBloodPressure: number, diaBloodPressure: number): string {
    return getRiskLevel(sysBloodPressure, diaBloodPressure, this.hospitalSetting.hospital_setting);
  }

  /**
   * Get level blood pressure follow sys
   *
   * @param sysBloodPressure - number type
   */
  public getSysBloodPressureFollowLevel(sysBloodPressure: number): string {
    return getSysBloodPressureFollowLevel(sysBloodPressure, this.hospitalSetting.hospital_setting);
  }

  /**
   * Get level blood pressure follow dia
   *
   * @param diaBloodPressure - number type
   */
  public getDiaBloodPressureFollowLevel(diaBloodPressure: number): string {
    return getDiaBloodPressureFollowLevel(diaBloodPressure, this.hospitalSetting.hospital_setting);
  }

  /**
   * get nyha level I | II | III | IV
   *
   * @param nyha - number
   */
  public getLevelNYHA(nyha: number): string {
    return getLevelNYHA(nyha);
  }

  /**
   * get latest data sync
   *
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
   * take numberFix digit after comma
   * @param value - value need handle
   * @param numberFix -
   */
  public fixNumber(value: number, numberFix: number = 1): string {
    return fixNumber(value, numberFix);
  }

  /**
   * Get tooltip placement
   * @param componentCode
   */
  public getTooltipPlacement(componentCode: string): string {
    if (this.lastComponentCode === this.firstComponentCode) return 'bottom';
    if (componentCode === this.firstComponentCode) return 'bottom-left';
    if (componentCode === this.lastComponentCode) return 'bottom-right';
    return 'bottom';
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
}
