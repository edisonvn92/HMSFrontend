import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import hospitalPatient from '@data/json/hospitalPatient.json';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { gender } from '@shared/helpers/data';
import { ToastService } from '@shared/services/toast.service';
import { ConfirmModalService } from '@shared/services/confirm-modal.service';
import { GroupService } from '@data/services/hospital/group.service';
import { SharedService } from '@shared/services/shared.service';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { PatientService } from '@data/services/hospital/patient.service';
import { IHospitalPatientList } from '@data/models/patientDetail';
import { IGroup } from '@data/models/group';
import { scrollToTop, joinName } from '@shared/helpers';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { StorageService } from '@shared/services/storage.service';
import { UserGroupListComponent } from '../user-list/user-group-list/user-group-list.component';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
})
export class PatientListComponent implements OnInit, OnDestroy {
  @ViewChild('sexDropdown', { static: false, read: NgbDropdown }) ngbSexDropdown!: NgbDropdown;
  @ViewChild('groupDropdown', { static: false, read: NgbDropdown }) ngbGroupDropdown!: NgbDropdown;
  public page: number = 1;
  public activeSortColumn: string = 'patient_code';
  public sortType: string = '';
  public patientList: IHospitalPatientList = {
    data: [],
    current_page: 0,
    last_page: 0,
    per_page: 0,
    total: 0,
  };
  public groupList: IGroup[] = [];
  public gender = JSON.parse(JSON.stringify(gender));
  public originalFields = hospitalPatient.originalFields;
  public groupSelectedString = '';
  public tableFields: { [key: string]: any } = {};
  selectedGroup: any = { group_id: undefined, group_name: '--' };
  selectedGender: any = { value: undefined, text: '--' };
  public isSearching = false;
  public param: any = {
    page: 1,
    limit: 20,
    sort: {
      attribute: '',
      type: '',
    },
    filter: {
      like: {
        patient_code: '',
        patient_full_name: '',
      },
      equal: {
        patient_gender: undefined,
        group_id: undefined,
      },
    },
  };
  public initParam = JSON.parse(JSON.stringify(this.param));
  searchForm = this.formBuilder.group({
    idSearch: '',
    groupId: this.selectedGroup.group_id,
    nameSearch: '',
    genderSearch: this.selectedGender.value,
  });

  constructor(
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmModalService: ConfirmModalService,
    public sharedService: SharedService,
    private groupService: GroupService,
    private modalService: NgbModal,
    private patientService: PatientService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private storageService: StorageService
  ) {}

  ngOnDestroy(): void {
    this.storageService.removeFromSession('patientParams');
  }

  ngOnInit() {
    this.tableFields = JSON.parse(JSON.stringify(this.originalFields));
    if (this.storageService.getFromSession('patientParams')) {
      let storageParam = this.storageService.getFromSession('patientParams');
      this.searchForm.patchValue({
        idSearch: storageParam.filter.like.patient_code,
        groupId: storageParam.filter.equal.group_id,
        nameSearch: storageParam.filter.like.patient_full_name,
        genderSearch: storageParam.filter.equal.patient_gender,
      });
      this.param = storageParam;
      if (storageParam.filter.equal.patient_gender !== null && storageParam.filter.equal.patient_gender !== undefined) {
        this.selectedGender = this.gender.find(
          (gender: any) => gender.value === storageParam.filter.equal.patient_gender
        );
      }
      if (storageParam.sort) {
        this.activeSortColumn = storageParam.sort.attribute;

        if (!this.tableFields[this.activeSortColumn].isSort) {
          this.tableFields[this.activeSortColumn].isSort = true;
          this.tableFields[this.activeSortColumn].sortType = storageParam.sort.type;
        }
      }
    } else {
      if (!this.tableFields['patient_code'].isSort) {
        this.tableFields['patient_code'].isSort = true;
        this.tableFields['patient_code'].sortType = 'asc';
      }
    }
    this.getListGroup();
  }

  /**
   * function call to get list data
   * @param isSearch:boolean
   * @param data: data type {page:number, perPage:number }
   */
  public findRecords(isSearch: boolean = false, data?: any): void {
    scrollToTop('table-content');
    this.isSearching = true;
    if (isSearch) {
      this.param.page = 1;
      this.setSearchParams();
    }

    if (data) {
      this.param.limit = data.perPage;
      this.param.page = data.page;
    }

    if (this.param.filter.equal.group_id === null) {
      delete this.param.filter.equal.group_id;
    }
    if (this.param.filter.equal.patient_gender === null) {
      delete this.param.filter.equal.patient_gender;
    }

    this.param.sort.attribute = this.activeSortColumn;
    this.param.sort.type = this.tableFields[this.activeSortColumn]?.sortType;

    this.patientService.findMany(this.param).subscribe(
      (data) => {
        this.patientList = data;
        this.sharedService.showLoadingEventEmitter.emit(false);
        this.storageService.setToSession('patientParams', this.param);
        this.isSearching = false;
      },
      () => {
        this.sharedService.showLoadingEventEmitter.emit(false);
        this.isSearching = false;
      }
    );
    this.cdr.detectChanges();
  }

  /**
   * set search param for list
   */
  setSearchParams() {
    this.param.filter = {
      like: {
        patient_code: this.searchForm.get('idSearch')?.value.trim(),
        patient_full_name: this.searchForm.get('nameSearch')?.value.trim(),
      },
      equal: {
        group_id: this.searchForm.get('groupId')?.value ? this.searchForm.get('groupId')?.value : undefined,
        patient_gender: ![null, undefined].includes(this.searchForm.get('genderSearch')?.value)
          ? this.searchForm.get('genderSearch')?.value
          : undefined,
      },
    };
  }

  /**
   * get list Group
   */
  public getListGroup(page: number = 1) {
    var params = { page: page, limit: 1000 };
    this.groupService.findMany(params).subscribe((data) => {
      this.groupList = this.groupList.concat(data.data);
      if (data.total > this.groupList.length) {
        this.getListGroup(page + 1);
      } else {
        let storageParam = this.storageService.getFromSession('patientParams');
        if (
          storageParam &&
          storageParam.filter.equal.group_id !== null &&
          storageParam.filter.equal.group_id !== undefined
        ) {
          let group = this.groupList.find((group: any) => group.group_id === storageParam.filter.equal.group_id);
          if (!group) {
            this.selectedGroup = { group_id: undefined, group_name: '--' };
            storageParam.filter.equal.group_id = undefined;
            this.storageService.setToSession('patientParams', storageParam);
          } else {
            this.selectedGroup = group;
          }
        }
        this.findRecords(false);
      }
    });
  }

  /**
   * get  fullName
   */
  public getFullName(
    firstName: string | undefined,
    middleName: string | undefined,
    lastName: string | undefined
  ): string {
    return joinName(firstName, middleName, lastName);
  }

  /**
   * Handles the event when the update button is clicked.
   */
  public updateClicked(id: string, isEdit: boolean = false): void {
    const modalRef = this.modalService.open(EditPatientComponent, {
      size: 'lg',
      backdrop: 'static',
      modalDialogClass: 'w-830 mt-96',
    });

    modalRef.componentInstance.isEdit = isEdit;
    modalRef.componentInstance.patientID = id;
    modalRef.closed.subscribe(() => {
      this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
      this.findRecords(false);
    });
  }

  /**
   * Handles the event when the delete button is clicked.
   */
  public deleteClicked(data: any): void {
    this.confirmModalService.open('do you want to delete?').subscribe(() => {
      this.patientService.delete({ patient_id: data.patient_id }).subscribe(
        () => {
          this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
          this.findRecords(false);
        },
        () => {
          let field = this.translate.instant('Patient');
          let mess = this.translate.instant(':field does not exist', { field: field });
          this.toastService.show(mess, { className: 'bg-red-100' });
          this.findRecords(false);
        }
      );
    });
  }

  /**
   * Handles the event when the reset button is clicked.
   */
  public resetSearchClicked() {
    this.param.filter = JSON.parse(JSON.stringify(this.initParam.filter));
    this.selectedGroup = { group_id: undefined, group_name: '--' };
    this.selectedGender = { value: undefined, text: '--' };
    this.tableFields = JSON.parse(JSON.stringify(this.originalFields));
    if (!this.tableFields['patient_code'].isSort) {
      this.tableFields['patient_code'].isSort = true;
      this.tableFields['patient_code'].sortType = 'asc';
    }
    this.searchForm.patchValue({
      idSearch: '',
      groupId: undefined,
      nameSearch: '',
      genderSearch: undefined,
    });
    this.activeSortColumn = 'patient_code';
    this.findRecords(true);
  }

  /**
   * Handles the event when the reset button is clicked.
   */
  public selectedItemSearch(isSelectGender: boolean = false, value?: any) {
    if (!isSelectGender) {
      this.selectedGroup = value ? value : { group_id: undefined, group_name: '--' };
      this.searchForm.patchValue({ groupId: this.selectedGroup.group_id });
      this.ngbGroupDropdown.close();
    } else {
      this.selectedGender = value ? value : { value: undefined, text: '--' };
      this.searchForm.patchValue({ genderSearch: this.selectedGender.value });
      this.ngbSexDropdown.close();
    }
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
      this.activeSortColumn = '';
    } else {
      this.tableFields[this.activeSortColumn].sortType = 'asc';
    }

    this.findRecords(false);
  }

  /**
   * open group of patient is clicked
   * @param patient
   */
  openGroupList(patient: any): void {
    const modalRef = this.modalService.open(UserGroupListComponent, {
      backdrop: 'static',
      size: 'lg',
      modalDialogClass: 'w-384',
    });

    modalRef.componentInstance.groupList = patient.groups;
  }
}
