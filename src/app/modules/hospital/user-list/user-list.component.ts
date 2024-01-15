import userList from '@data/json/userList.json';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { roles } from '@shared/helpers/data';
import { ToastService } from '@shared/services/toast.service';
import { ConfirmModalService } from '@shared/services/confirm-modal.service';
import { HcpService } from '@data/services/hospital/hcp.service';
import { SharedService } from '@shared/services/shared.service';
import { GroupService } from '@data/services/hospital/group.service';
import { IGroup } from '@data/models/group';
import { IHcpList } from '@data/models/hcp';
import { CreateUserComponent } from './create-user/create-user.component';
import { scrollToTop } from '@shared/helpers';
import { UserGroupListComponent } from '@modules/hospital/user-list/user-group-list/user-group-list.component';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '@data/services/authentication.service';
import { FormBuilder } from '@angular/forms';
import { StorageService } from '@shared/services/storage.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  @ViewChild('roleDropdown', { static: false, read: NgbDropdown }) ngbRoleDropdown!: NgbDropdown;
  @ViewChild('groupDropdown', { static: false, read: NgbDropdown }) ngbGroupDropdown!: NgbDropdown;
  public page: number = 1;
  public activeSortColumn: string = 'hcp_cognito_username';
  public defaultSortColumn: string = 'hcp_cognito_username';
  public sortType: string = '';
  public userList: IHcpList = {
    data: [],
    current_page: 0,
    last_page: 0,
    per_page: 0,
    total: 0,
  };
  public groupList: IGroup[] = [];
  public roles = JSON.parse(JSON.stringify(roles));
  public textSearch = '';
  public originalFields = userList.originalFields;
  public groupSelectedString = '';
  public tableFields: { [key: string]: any } = {};
  selectedGroup: any = { group_id: undefined, group_name: '--' };
  selectedRole: any = { role_id: undefined, role_name: '--' };
  public currentUser: any;
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
        hcp_cognito_username: '',
        hcp_cognito_phone: '',
        hcp_name: '',
      },
      equal: {
        group_id: undefined,
        role_id: undefined,
      },
    },
  };
  public initParam = JSON.parse(JSON.stringify(this.param));
  searchForm = this.formBuilder.group({
    idSearch: '',
    telSearch: '',
    groupId: this.selectedGroup.group_id,
    nameSearch: '',
    roleId: this.selectedRole.role_id,
  });

  constructor(
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmModalService: ConfirmModalService,
    private hcpService: HcpService,
    public sharedService: SharedService,
    private groupService: GroupService,
    private modalService: NgbModal,
    private translate: TranslateService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private storageService: StorageService
  ) {}

  ngOnDestroy(): void {
    this.storageService.removeFromSession('userParams');
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUserInfo();
    this.tableFields = JSON.parse(JSON.stringify(this.originalFields));
    if (this.storageService.getFromSession('userParams')) {
      let storageParam = this.storageService.getFromSession('userParams');
      this.param = storageParam;
      this.searchForm.patchValue({
        idSearch: storageParam.filter.like.hcp_cognito_username,
        telSearch: storageParam.filter.like.hcp_cognito_phone,
        groupId: storageParam.filter.equal.group_id,
        nameSearch: storageParam.filter.like.hcp_name,
        roleId: storageParam.filter.equal.role_id,
      });
      if (storageParam.filter.equal.role_id !== null && storageParam.filter.equal.role_id !== undefined) {
        this.selectedRole = this.roles.find((role: any) => role.role_id === storageParam.filter.equal.role_id);
      }
      if (storageParam.sort) {
        this.activeSortColumn = storageParam.sort.attribute;

        if (!this.tableFields[this.activeSortColumn].isSort) {
          this.tableFields[this.activeSortColumn].isSort = true;
          this.tableFields[this.activeSortColumn].sortType = storageParam.sort.type;
        }
      }
    } else {
      if (!this.tableFields[this.defaultSortColumn].isSort) {
        this.tableFields[this.defaultSortColumn].isSort = true;
        this.tableFields[this.defaultSortColumn].sortType = 'asc';
      }
    }
    this.getListGroup();
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
      this.setSearchParams();
    }

    if (data) {
      this.param.limit = data.perPage;
      this.param.page = data.page;
    }

    this.param.sort.attribute = this.activeSortColumn;
    this.param.sort.type = this.tableFields[this.activeSortColumn]?.sortType;

    if (this.param.filter.equal.group_id === null) {
      delete this.param.filter.equal.group_id;
    }
    if (this.param.filter.equal.role_id === null) {
      delete this.param.filter.equal.role_id;
    }

    this.hcpService.findMany(this.param).subscribe(
      (data) => {
        this.userList = data;
        this.storageService.setToSession('userParams', this.param);
        this.sharedService.showLoadingEventEmitter.emit(false);
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
        hcp_cognito_username: this.searchForm.get('idSearch')?.value.trim(),
        hcp_cognito_phone: this.searchForm.get('telSearch')?.value.trim(),
        hcp_name: this.searchForm.get('nameSearch')?.value.trim(),
      },
      equal: {
        group_id: this.searchForm.get('groupId')?.value ? this.searchForm.get('groupId')?.value : undefined,
        role_id: this.searchForm.get('roleId')?.value ? this.searchForm.get('roleId')?.value : undefined,
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
        let storageParam = this.storageService.getFromSession('userParams');
        if (
          storageParam &&
          storageParam.filter.equal.group_id !== null &&
          storageParam.filter.equal.group_id !== undefined
        ) {
          let group = this.groupList.find((group: any) => group.group_id === storageParam.filter.equal.group_id);
          if (!group) {
            this.selectedGroup = { group_id: undefined, group_name: '--' };
            storageParam.equal.group_id = undefined;
            this.storageService.setToSession('userParams', storageParam);
          } else {
            this.selectedGroup = group;
          }
        }
        this.findRecords(false);
      }
    });
  }

  /**
   * Handles the event when the create button is clicked.
   */
  public createClicked(data?: any): void {
    const modalRef = this.modalService.open(CreateUserComponent, {
      size: 'lg',
      backdrop: 'static',
      modalDialogClass: 'w-720 mt-96',
    });
    if (data) {
      modalRef.componentInstance.isCreate = false;
      modalRef.componentInstance.hcp_id = data.hcp_id;
      modalRef.componentInstance.noRoleSetting = !!data.hcp_none_delete || data.hcp_id === this.currentUser.hcp_id;
    }
    modalRef.closed.subscribe(() => {
      this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
      this.findRecords(false);
    });
  }

  /**
   * Handles the event when the delete button is clicked.
   */
  public deleteClicked(data: any): void {
    if (!data.hcp_none_delete && data.hcp_id !== this.currentUser.hcp_id) {
      this.confirmModalService.open('do you want to delete?').subscribe(() => {
        this.hcpService.delete({ hcp_id: data.hcp_id }).subscribe(
          () => {
            this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
            this.findRecords(false);
          },
          (error: any) => {
            let mess = this.translate.instant(error.error.message);
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
    this.param.filter = JSON.parse(JSON.stringify(this.initParam.filter));
    this.selectedGroup = { group_id: undefined, group_name: '--' };
    this.selectedRole = { role_id: undefined, role_name: '--' };
    this.searchForm.patchValue({
      idSearch: '',
      telSearch: '',
      groupId: undefined,
      nameSearch: '',
      roleId: undefined,
    });
    this.tableFields = JSON.parse(JSON.stringify(this.originalFields));
    if (!this.tableFields[this.defaultSortColumn].isSort) {
      this.tableFields[this.defaultSortColumn].isSort = true;
      this.tableFields[this.defaultSortColumn].sortType = 'asc';
    }
    this.activeSortColumn = this.defaultSortColumn;

    this.findRecords(true);
  }

  /**
   * Handles the event when the reset button is clicked.
   */
  public selectedItemSearch(isSelectRole: boolean = false, value?: any) {
    if (!isSelectRole) {
      this.selectedGroup = value ? value : { group_id: undefined, group_name: '--' };
      this.searchForm.patchValue({ groupId: this.selectedGroup.group_id });
      this.ngbGroupDropdown.close();
    } else {
      this.selectedRole = value ? value : { role_id: undefined, role_name: '--' };
      this.searchForm.patchValue({ roleId: this.selectedRole.role_id });
      this.ngbRoleDropdown.close();
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
   * open group of user is clicked
   * @param user
   */
  openGroupList(user: any): void {
    const modalRef = this.modalService.open(UserGroupListComponent, {
      backdrop: 'static',
      size: 'lg',
      modalDialogClass: 'w-384',
    });

    modalRef.componentInstance.groupList = user.groups;
  }
}
