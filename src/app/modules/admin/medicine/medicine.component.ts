import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MedicineService } from '@data/services/admin/medicine.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { scrollToTop } from '@shared/helpers';
import { ConfirmModalService } from '@shared/services/confirm-modal.service';
import { SharedService } from '@shared/services/shared.service';
import { StorageService } from '@shared/services/storage.service';
import { ToastService } from '@shared/services/toast.service';
import moment from 'moment';
import { CreateMedicineComponent } from './create-medicine/create-medicine.component';
import { originalFields } from './data';

@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.scss'],
})
export class MedicineComponent implements OnInit, OnDestroy {
  public originalFields = originalFields;
  public tableFields: { [key: string]: any } = {};
  public activeSortColumn: string = 'hospital_medicine_id';
  public isSearching = false;
  public medicineList: any = {
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
        hospital_medicine_id: '',
        hospital_medicine_name: '',
        hospital_medicine_description: '',
      },
      created_date: {
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
    descriptionSearch: '',
    startDate: undefined,
    endDate: undefined,
  });

  constructor(
    public sharedService: SharedService,
    private confirmModalService: ConfirmModalService,
    public toastService: ToastService,
    public translate: TranslateService,
    public medicineService: MedicineService,
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private storageService: StorageService
  ) {}

  ngOnDestroy(): void {
    this.storageService.removeFromSession('medicineParams');
  }

  ngOnInit(): void {
    this.tableFields = JSON.parse(JSON.stringify(this.originalFields));
    if (this.storageService.getFromSession('medicineParams')) {
      let storageParam = this.storageService.getFromSession('medicineParams');
      this.searchForm.patchValue({
        idSearch: storageParam.filter.like.hospital_medicine_id,
        nameSearch: storageParam.filter.like.hospital_medicine_name,
        descriptionSearch: storageParam.filter.like.hospital_medicine_description,
      });
      if (storageParam.filter.created_date.start_date) {
        this.searchingStartDate = new Date(storageParam.filter.created_date.start_date);
        this.searchForm.patchValue({
          startDate: storageParam.filter.created_date.start_date,
        });
      }
      if (storageParam.filter.created_date.end_date) {
        this.searchingEndDate = new Date(storageParam.filter.created_date.end_date);
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
      if (!this.tableFields['hospital_medicine_id'].isSort) {
        this.tableFields['hospital_medicine_id'].isSort = true;
        this.tableFields['hospital_medicine_id'].sortType = 'desc';
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

    this.medicineService.findMany(this.param).subscribe(
      (data) => {
        this.medicineList = data;
        this.sharedService.showLoadingEventEmitter.emit(false);
        this.storageService.setToSession('medicineParams', this.param);
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
        hospital_medicine_id: this.searchForm.get('idSearch')?.value,
        hospital_medicine_name: this.searchForm.get('nameSearch')?.value.trim(),
        hospital_medicine_description: this.searchForm.get('descriptionSearch')?.value.trim(),
      },
      created_date: {
        start_date: this.searchForm.get('startDate')?.value ? this.searchForm.get('startDate')?.value : undefined,
        end_date: this.searchForm.get('endDate')?.value ? this.searchForm.get('endDate')?.value : undefined,
      },
    };
  }

  /**
   * Handles the event when the reset button is clicked.
   */
  public resetSearchClicked() {
    this.searchForm.patchValue({
      idSearch: '',
      nameSearch: '',
      descriptionSearch: '',
      startDate: undefined,
      endDate: undefined,
    });
    this.setSearchParams();
    this.searchingStartDate = null;
    this.searchingEndDate = null;
    this.tableFields = JSON.parse(JSON.stringify(this.originalFields));
    if (!this.tableFields['hospital_medicine_id'].isSort) {
      this.tableFields['hospital_medicine_id'].isSort = true;
      this.tableFields['hospital_medicine_id'].sortType = 'desc';
    }
    this.activeSortColumn = 'hospital_medicine_id';
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
   * @param medicineId medicine id
   */
  onCreateMedicine(medicineId?: string) {
    const modalRef = this.modalService.open(CreateMedicineComponent, {
      size: 'lg',
      backdrop: 'static',
      modalDialogClass: 'w-572 mt-96',
    });
    modalRef.componentInstance.medicine_id = medicineId;
    modalRef.closed.subscribe(() => {
      this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
      this.findRecords(false);
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
        this.param.filter.created_date.end_date = moment(this.searchingEndDate).format('YYYY-MM-DD');
      }
      this.param.filter.created_date.start_date = moment(this.searchingStartDate).format('YYYY-MM-DD');
    } else {
      this.searchingEndDate = event;
      if (this.searchingStartDate && this.searchingStartDate > this.searchingEndDate!) {
        this.searchingStartDate = this.searchingEndDate;
      }

      if (this.searchingStartDate) {
        this.param.filter.created_date.start_date = moment(this.searchingStartDate).format('YYYY-MM-DD');
      }
      this.param.filter.created_date.end_date = moment(this.searchingEndDate).format('YYYY-MM-DD');
    }
    this.searchForm.patchValue({
      startDate: this.searchingStartDate ? moment(this.searchingStartDate).format('YYYY-MM-DD') : undefined,
      endDate: this.searchingEndDate ? moment(this.searchingEndDate).format('YYYY-MM-DD') : undefined,
    });
  }

  /**
   * Handles the event when the delete button is clicked.
   */
  public deleteClicked(data: any): void {
    this.confirmModalService.open('do you want to delete?').subscribe(() => {
      this.medicineService.delete({ hospital_medicine_id: data.hospital_medicine_id }).subscribe(
        () => {
          this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
          this.findRecords(false);
        },
        () => {
          let field = this.translate.instant('medicine');
          let mess = this.translate.instant(':field does not exist', { field: field });
          this.toastService.show(mess, { className: 'bg-red-100' });
          this.findRecords(false);
        }
      );
    });
  }

  /**
   * handle event when medicine input is changed
   * @param e
   */
  onChangeID(e: any) {
    const value = e.target.value.normalize('NFKC').replaceAll(/[^0-9]/g, '');
    this.searchForm.controls.idSearch.setValue(value);
    e.target.value = value;
  }
}
