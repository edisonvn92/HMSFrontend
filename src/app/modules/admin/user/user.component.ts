import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateUserComponent } from './create-user/create-user.component';
import { scrollToTop } from '@shared/helpers';
import { originalFields } from './data';
import { HospitalService } from '@data/services/admin/hospital.service';
import { HcpService } from '@data/services/admin/hcp.service';
import { ConfirmModalService } from '@shared/services/confirm-modal.service';
import { ToastService } from '@shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { FormBuilder } from '@angular/forms';
import { StorageService } from '@shared/services/storage.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  @ViewChild('hospitalDropdown', { static: false, read: NgbDropdown }) ngbHospitalDropdown!: NgbDropdown;

  public originalFields = originalFields;
  public tableFields: { [key: string]: any } = {};
  public hospitalSearchName: string = '--';
  public activeSortColumn: string = 'hospital_name';
  public hospitalList: any[] = [];
  public currentUser: any;
  public isSearching = false;
  public userList: any = {
    data: [],
    current_page: 0,
    last_page: 0,
    per_page: 0,
    total: 0,
  };
  public param: any = {
    page: 1,
    limit: 20,
    sort: {
      attribute: '',
      type: '',
    },
    filter: {
      like: {
        hcp_cognito_username: '',
        hcp_cognito_phone: '',
        hcp_full_name: '',
      },
      equal: {
        hospital_id: undefined,
      },
      created_at: {
        start_date: undefined,
        end_date: undefined,
      },
    },
    timezone_offset: new Date().getTimezoneOffset(),
  };
  searchingStartDate: Date | null = null;
  searchingEndDate: Date | null = null;
  currentDate: Date = new Date();
  public initParam = JSON.parse(JSON.stringify(this.param));
  searchForm = this.formBuilder.group({
    hospitalSearch: undefined,
    idSearch: '',
    nameSearch: '',
    telSearch: '',
    startDate: undefined,
    endDate: undefined,
  });

  constructor(
    public sharedService: SharedService,
    private modalService: NgbModal,
    private hospitalService: HospitalService,
    private hcpService: HcpService,
    private confirmModalService: ConfirmModalService,
    private toastService: ToastService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private storageService: StorageService
  ) {}

  ngOnDestroy(): void {
    this.storageService.removeFromSession('userParams');
  }

  ngOnInit() {
    this.tableFields = JSON.parse(JSON.stringify(this.originalFields));
    if (this.storageService.getFromSession('userParams')) {
      let storageParam = this.storageService.getFromSession('userParams');
      this.searchForm.patchValue({
        idSearch: storageParam.filter.like.hcp_cognito_username,
        nameSearch: storageParam.filter.like.hcp_full_name,
        telSearch: storageParam.filter.like.hcp_cognito_phone,
      });
      if (storageParam.filter.created_at.start_date) {
        this.searchingStartDate = new Date(storageParam.filter.created_at.start_date);
        this.searchForm.patchValue({
          startDate: storageParam.filter.created_at.start_date,
        });
      }
      if (storageParam.filter.created_at.end_date) {
        this.searchingEndDate = new Date(storageParam.filter.created_at.end_date);
        this.searchForm.patchValue({
          endDate: storageParam.filter.created_at.end_date,
        });
      }
      this.param = storageParam;
      if (storageParam.sort) {
        this.activeSortColumn = storageParam.sort.attribute;

        if (!this.tableFields[this.activeSortColumn].isSort) {
          this.tableFields[this.activeSortColumn].isSort = true;
          this.tableFields[this.activeSortColumn].sortType = storageParam.sort.type;
        }
      }
    } else {
      if (!this.tableFields[this.activeSortColumn].isSort) {
        this.tableFields[this.activeSortColumn].isSort = true;
        this.tableFields[this.activeSortColumn].sortType = 'asc';
      }
    }
    this.findRecords(false, true);
  }

  /**
   * function to get hospital list
   */
  getHospitalList(page: number = 1, onInit: boolean = false) {
    const params = { page: page, limit: 1000, timezone_offset: new Date().getTimezoneOffset() };
    this.hospitalService.findMany(params).subscribe((data: any) => {
      this.hospitalList = this.hospitalList.concat(data.data);
      if (data.total > this.hospitalList.length) {
        this.getHospitalList(page + 1);
      }
      if (onInit) {
        let storageParam = this.storageService.getFromSession('userParams');
        if (
          storageParam &&
          storageParam.filter.equal.hospital_id !== null &&
          storageParam.filter.equal.hospital_id !== undefined
        ) {
          let currentHospital = this.hospitalList.find(
            (hospital: any) => hospital.hospital_id === storageParam.filter.equal.hospital_id
          );
          this.hospitalSearchName = currentHospital ? currentHospital.hospital_name : '--';
          this.searchForm.patchValue({
            hospitalSearch: storageParam.filter.equal.hospital_id,
          });
        }
      }
    });
  }

  /**
   * function call to get geoup list
   * @param isSearch:boolean
   * @param data: data type {page:number, perPage:number }
   */
  public findRecords(isSearch: boolean = false, onInit: boolean = false, data?: any): void {
    this.hospitalList = [];
    this.isSearching = true;
    scrollToTop('table-content');
    if (isSearch) {
      this.param.page = 1;
      this.setSearchParams();
    }
    this.getHospitalList(1, onInit);

    if (data) {
      this.param.limit = data.perPage;
      this.param.page = data.page;
    }

    this.param.sort.attribute = this.activeSortColumn;
    this.param.sort.type = this.tableFields[this.activeSortColumn]?.sortType;
    this.hcpService.findMany(this.param).subscribe(
      (data: any) => {
        this.userList = data;
        this.storageService.setToSession('userParams', this.param);
        this.sharedService.showLoadingEventEmitter.emit(false);
        this.isSearching = false;
      },
      (err) => {
        this.sharedService.showLoadingEventEmitter.emit(false);
        this.isSearching = false;
      }
    );
  }

  /**
   * set search param for list
   */
  setSearchParams() {
    this.param.filter = {
      like: {
        hcp_cognito_username: this.searchForm.get('idSearch')?.value.trim(),
        hcp_cognito_phone: this.searchForm.get('telSearch')?.value.trim(),
        hcp_full_name: this.searchForm.get('nameSearch')?.value.trim(),
      },
      equal: {
        hospital_id: this.searchForm.get('hospitalSearch')?.value
          ? this.searchForm.get('hospitalSearch')?.value
          : undefined,
      },
      created_at: {
        start_date: this.searchForm.get('startDate')?.value ? this.searchForm.get('startDate')?.value : undefined,
        end_date: this.searchForm.get('endDate')?.value ? this.searchForm.get('endDate')?.value : undefined,
      },
    };
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
   * Handles the event when user select hospital.
   */
  public selectedItemSearch(value?: any, text?: string) {
    this.searchForm.patchValue({ hospitalSearch: value });
    this.hospitalSearchName = text ? text : '--';
    this.ngbHospitalDropdown.close();
  }

  /**
   * Handle the event when click reset
   */
  public resetSearchClicked() {
    this.param.filter = JSON.parse(JSON.stringify(this.initParam.filter));
    this.tableFields = JSON.parse(JSON.stringify(this.originalFields));
    if (!this.tableFields['hospital_name'].isSort) {
      this.tableFields['hospital_name'].isSort = true;
      this.tableFields['hospital_name'].sortType = 'asc';
    }
    this.searchForm.patchValue({
      hospitalSearch: '',
      idSearch: '',
      nameSearch: '',
      telSearch: '',
      startDate: undefined,
      endDate: undefined,
    });
    this.storageService.removeFromSession('userParams');
    this.activeSortColumn = 'hospital_name';
    this.hospitalSearchName = '--';
    this.searchingStartDate = null;
    this.searchingEndDate = null;
    this.findRecords(true);
  }

  /**
   * Handles the event when create button is clicked
   */
  createUser() {
    const modalRef = this.modalService.open(CreateUserComponent, {
      size: 'lg',
      backdrop: 'static',
      modalDialogClass: 'w-720 mt-96',
    });
    modalRef.closed.subscribe(() => {
      this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
      this.findRecords(false);
    });
  }

  /**
   * Handles the event when the update button is clicked.
   */
  public updateClicked(id: string): void {
    const modalRef = this.modalService.open(CreateUserComponent, {
      size: 'lg',
      backdrop: 'static',
      modalDialogClass: 'w-720 mt-96',
    });
    modalRef.componentInstance.isCreate = false;
    modalRef.componentInstance.hcpId = id;
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
      this.hcpService.delete({ hcp_id: data.hcp_id }).subscribe(
        () => {
          this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
          this.findRecords(false);
        },
        () => {
          let field = this.translate.instant('user');
          let mess = this.translate.instant(':field does not exist', { field: field });
          this.toastService.show(mess, { className: 'bg-red-100' });
          this.findRecords(false);
        }
      );
    });
  }

  /**
   * function when choosing start date for search
   * @param event date chosen
   */
  onChooseStartDate(event: any) {
    this.searchingStartDate = event;

    if (this.searchingEndDate && this.searchingEndDate < this.searchingStartDate!) {
      this.searchingEndDate = this.searchingStartDate;
    }

    if (this.searchingEndDate) {
      this.param.filter.created_at.end_date = moment(this.searchingEndDate).format('YYYY-MM-DD');
    }

    this.param.filter.created_at.start_date = moment(this.searchingStartDate).format('YYYY-MM-DD');
    this.searchForm.patchValue({
      startDate: this.searchingStartDate ? moment(this.searchingStartDate).format('YYYY-MM-DD') : undefined,
      endDate: this.searchingEndDate ? moment(this.searchingEndDate).format('YYYY-MM-DD') : undefined,
    });
  }

  /**
   * function when choosing end date for search
   * @param event date chosen
   */
  onChooseEndDate(event: any) {
    this.searchingEndDate = event;
    if (this.searchingStartDate && this.searchingStartDate > this.searchingEndDate!) {
      this.searchingStartDate = this.searchingEndDate;
    }

    if (this.searchingStartDate) {
      this.param.filter.created_at.start_date = moment(this.searchingStartDate).format('YYYY-MM-DD');
    }

    this.param.filter.created_at.end_date = moment(this.searchingEndDate).format('YYYY-MM-DD');
    this.searchForm.patchValue({
      startDate: this.searchingStartDate ? moment(this.searchingStartDate).format('YYYY-MM-DD') : undefined,
      endDate: this.searchingEndDate ? moment(this.searchingEndDate).format('YYYY-MM-DD') : undefined,
    });
  }
}
