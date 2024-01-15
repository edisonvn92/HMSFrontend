import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalService } from '@shared/services/confirm-modal.service';
import { CreateGroupComponent } from './create-group/create-group.component';

import groupListData from '@data/json/groupList.json';
import { IGroup, IGroupList } from '@data/models/group';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { GroupService } from '@data/services/hospital/group.service';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import { scrollToTop } from '@shared/helpers';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '@shared/services/storage.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
})
export class GroupListComponent implements OnInit, OnDestroy {
  public page: number = 1;
  public activeSortColumn: string = 'group_name';
  public sortType: string = '';
  public groupList: IGroupList = {
    data: [],
    current_page: 1,
    last_page: 0,
    per_page: 0,
    total: 0,
  };
  public textSearch = '';
  public originalFields = groupListData.originalFields;
  public tableFields: { [key: string]: any } = {};
  public isSearching = false;
  public param = {
    page: 1,
    limit: 20,
    sort: {
      attribute: '',
      type: '',
    },
    filter: {
      like: {
        group_name: '',
      },
    },
  };

  constructor(
    private modalService: NgbModal,
    private confirmModalService: ConfirmModalService,
    private groupService: GroupService,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
    private toastService: ToastService,
    private translate: TranslateService,
    private storageService: StorageService
  ) {}

  ngOnDestroy(): void {
    this.storageService.removeFromSession('groupParams');
  }

  ngOnInit() {
    this.tableFields = JSON.parse(JSON.stringify(this.originalFields));
    if (this.storageService.getFromSession('groupParams')) {
      let storageParam = this.storageService.getFromSession('groupParams');
      if (storageParam.sort) {
        this.activeSortColumn = storageParam.sort.attribute;

        if (!this.tableFields[this.activeSortColumn].isSort) {
          this.tableFields[this.activeSortColumn].isSort = true;
          this.tableFields[this.activeSortColumn].sortType = storageParam.sort.type;
        }
      }
      this.param = storageParam;
      this.textSearch = this.param.filter.like.group_name;
    } else {
      if (!this.tableFields['group_name'].isSort) {
        this.tableFields['group_name'].isSort = true;
        this.tableFields['group_name'].sortType = 'asc';
      }
    }
    this.findRecords(false);
  }

  /**
   * function call to get geoup list
   * @param isSearch:boolean
   * @param data: data type {page:number, perPage:number }
   */
  public findRecords(isSearch: boolean = false, data?: any): void {
    scrollToTop('table-content');
    this.isSearching = true;
    if (isSearch) {
      this.param.page = 1;
      this.param.filter.like.group_name = this.textSearch.trim();
    }

    if (data) {
      this.param.limit = data.perPage;
      this.param.page = data.page;
    }

    this.param.sort.attribute = this.activeSortColumn;
    this.param.sort.type = this.tableFields[this.activeSortColumn]?.sortType;
    this.groupService.findMany(this.param).subscribe(
      (data) => {
        this.sharedService.showLoadingEventEmitter.emit(false);
        this.groupList = data;
        this.isSearching = false;
        this.storageService.setToSession('groupParams', this.param);
      },
      () => {
        this.sharedService.showLoadingEventEmitter.emit(false);
        this.isSearching = false;
      }
    );

    this.cdr.detectChanges();
  }

  /**
   * Handles the event when the user click open detail .
   *
   * @param group - group id has been selected.
   */
  public onOpenDetailClicked(group?: IGroup): void {
    const modalRef = this.modalService.open(GroupDetailComponent, {
      size: 'lg',
      backdrop: 'static',
    });
    modalRef.componentInstance.group_id = group?.group_id;
    modalRef.dismissed.subscribe(() => {
      this.findRecords(false);
    });
    modalRef.componentInstance.emittedErr.subscribe(() => {
      this.findRecords(false);
    });
  }

  /**
   * Handles the event when the create button is clicked.
   */
  public createClicked(id?: number): void {
    const modalRef = this.modalService.open(CreateGroupComponent, {
      size: 'lg',
      backdrop: 'static',
      modalDialogClass: 'w-572 mt-96',
    });
    modalRef.componentInstance.group_id = id;
    modalRef.closed.subscribe(() => {
      this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
      this.findRecords(false);
    });
    modalRef.componentInstance.emittedErr.subscribe(() => {
      this.findRecords(false);
    });
  }

  /**
   * Handles the event when the delete button is clicked.
   */
  public deleteClicked(data: IGroup): void {
    if (data?.is_can_delete) {
      this.confirmModalService.open('do you want to delete?').subscribe(() => {
        this.groupService.delete({ group_id: data.group_id }).subscribe(
          () => {
            this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
            this.findRecords(false);
          },
          () => {
            let field = this.translate.instant('Group');
            let mess = this.translate.instant(':field does not exist', { field: field });
            this.toastService.show(mess, { className: 'bg-red-100' });
            this.findRecords(false);
          }
        );
      });
    }
  }

  /**
   * Handles the event when the reset button is clicked.
   */
  public resetSearchClicked() {
    this.textSearch = '';
    this.tableFields = JSON.parse(JSON.stringify(this.originalFields));
    if (!this.tableFields['group_name'].isSort) {
      this.tableFields['group_name'].isSort = true;
      this.tableFields['group_name'].sortType = 'asc';
    }
    this.activeSortColumn = 'group_name';
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
}
