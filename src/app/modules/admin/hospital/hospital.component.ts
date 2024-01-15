import { Component, OnDestroy, OnInit } from '@angular/core';
import { scrollToTop } from '@shared/helpers';
import { originalFields } from './data';
import { Router } from '@angular/router';
import { HospitalService } from '@data/services/admin/hospital.service';
import { SharedService } from '@shared/services/shared.service';
import { ConfirmModalService } from '@shared/services/confirm-modal.service';
import { ToastService } from '@shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { FormBuilder } from '@angular/forms';
import { StorageService } from '@shared/services/storage.service';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.scss'],
})
export class HospitalComponent implements OnInit, OnDestroy {
  public originalFields = originalFields;
  public tableFields: { [key: string]: any } = {};
  public activeSortColumn: string = 'hospital_code';
  public isSearching = false;
  public hospitalList: any = {
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
        hospital_code: '',
        hospital_name: '',
        hospital_address: '',
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
  searchForm = this.formBuilder.group({
    idSearch: '',
    nameSearch: '',
    addressSearch: '',
    startDate: undefined,
    endDate: undefined,
  });

  constructor(
    private router: Router,
    private hospitalService: HospitalService,
    public sharedService: SharedService,
    private confirmModalService: ConfirmModalService,
    private toastService: ToastService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private storageService: StorageService
  ) {}

  ngOnDestroy(): void {
    this.storageService.removeFromSession('hospitalParams');
  }

  ngOnInit(): void {
    this.tableFields = JSON.parse(JSON.stringify(this.originalFields));
    if (this.storageService.getFromSession('hospitalParams')) {
      let storageParam = this.storageService.getFromSession('hospitalParams');
      this.searchForm.patchValue({
        idSearch: storageParam.filter.like.hospital_code,
        nameSearch: storageParam.filter.like.hospital_name,
        addressSearch: storageParam.filter.like.hospital_address,
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
      if (!this.tableFields['hospital_code'].isSort) {
        this.tableFields['hospital_code'].isSort = true;
        this.tableFields['hospital_code'].sortType = 'asc';
      }
    }
    this.findRecords(false);
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

    this.param.sort.attribute = this.activeSortColumn;
    this.param.sort.type = this.tableFields[this.activeSortColumn]?.sortType;

    this.hospitalService.findMany(this.param).subscribe(
      (data) => {
        this.hospitalList = data;
        this.sharedService.showLoadingEventEmitter.emit(false);
        this.storageService.setToSession('hospitalParams', this.param);
        this.isSearching = false;
      },
      () => {
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
        hospital_code: this.searchForm.get('idSearch')?.value.trim(),
        hospital_name: this.searchForm.get('nameSearch')?.value.trim(),
        hospital_address: this.searchForm.get('addressSearch')?.value.trim(),
      },
      created_at: {
        start_date: this.searchForm.get('startDate')?.value ? this.searchForm.get('startDate')?.value : undefined,
        end_date: this.searchForm.get('endDate')?.value ? this.searchForm.get('endDate')?.value : undefined,
      },
    };
  }

  /**
   * Handles the event when the reset button is clicked.
   */
  public resetSearchClicked() {
    this.param.filter.like.hospital_address = '';
    this.param.filter.like.hospital_code = '';
    this.param.filter.like.hospital_name = '';
    delete this.param.filter.created_at.start_date;
    delete this.param.filter.created_at.end_date;
    this.searchingStartDate = null;
    this.searchingEndDate = null;
    this.tableFields = JSON.parse(JSON.stringify(this.originalFields));
    if (!this.tableFields['hospital_code'].isSort) {
      this.tableFields['hospital_code'].isSort = true;
      this.tableFields['hospital_code'].sortType = 'asc';
    }
    this.searchForm.patchValue({
      idSearch: '',
      nameSearch: '',
      addressSearch: '',
      startDate: undefined,
      endDate: undefined,
    });
    this.activeSortColumn = 'hospital_code';
    this.findRecords(true);
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
   * handle event when add button is clicked
   * @param hospitalID hospital id
   */
  onCreateHospital(hospitalID?: string) {
    if (hospitalID) {
      this.router.navigate(['/admin/hospital/edit'], {
        queryParams: { hospital_id: hospitalID },
      });
    } else {
      this.router.navigate(['/admin/hospital/create']);
    }
  }

  /**
   * Handles the event when the delete button is clicked.
   */
  public deleteClicked(data: any): void {
    this.confirmModalService.open('do you want to delete?').subscribe(() => {
      this.hospitalService.delete({ hospital_id: data.hospital_id }).subscribe(
        () => {
          this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
          this.findRecords(false);
        },
        () => {
          let field = this.translate.instant('hospital');
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
  onChooseDate(event: any, key: string = 'start') {
    if (key === 'start') {
      this.searchingStartDate = event;

      if (this.searchingEndDate && this.searchingEndDate < this.searchingStartDate!) {
        this.searchingEndDate = this.searchingStartDate;
      }

      if (this.searchingEndDate) {
        this.param.filter.created_at.end_date = moment(this.searchingEndDate).format('YYYY-MM-DD');
      }

      this.param.filter.created_at.start_date = moment(this.searchingStartDate).format('YYYY-MM-DD');
    } else {
      this.searchingEndDate = event;
      if (this.searchingStartDate && this.searchingStartDate > this.searchingEndDate!) {
        this.searchingStartDate = this.searchingEndDate;
      }

      if (this.searchingStartDate) {
        this.param.filter.created_at.start_date = moment(this.searchingStartDate).format('YYYY-MM-DD');
      }

      this.param.filter.created_at.end_date = moment(this.searchingEndDate).format('YYYY-MM-DD');
    }
    this.searchForm.patchValue({
      startDate: this.searchingStartDate ? moment(this.searchingStartDate).format('YYYY-MM-DD') : undefined,
      endDate: this.searchingEndDate ? moment(this.searchingEndDate).format('YYYY-MM-DD') : undefined,
    });
  }
}
