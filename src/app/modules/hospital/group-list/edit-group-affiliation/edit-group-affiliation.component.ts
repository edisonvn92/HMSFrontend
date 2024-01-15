import { TranslateService } from '@ngx-translate/core';
import groupList from '@data/json/groupList.json';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { RowSelectedDirective } from '@shared/directives';
import { IGroup } from '@data/models/group';
import { ConfirmModalService } from '@shared/services/confirm-modal.service';
import { GroupService } from '@data/services/hospital/group.service';
import { UserService } from '@data/services/hospital/user.service';
import { joinName } from '@shared/helpers';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-edit-group-affiliation',
  templateUrl: './edit-group-affiliation.component.html',
  styleUrls: ['./edit-group-affiliation.component.scss'],
})
export class EditGroupAffiliationComponent implements OnInit {
  @ViewChild(RowSelectedDirective, { static: true }) directive!: RowSelectedDirective;
  @ViewChild('groupDropdown', { static: false, read: NgbDropdown }) dropdown!: NgbDropdown;
  public groupDetail: IGroup = {
    group_default: 0,
    group_id: 0,
    group_name: '',
    hcps: [],
    other_groups: [],
    patients: [],
  };
  public groups = groupList.groupList.data;
  public data: any;
  public isEditPatient = false;
  public groupSelected: IGroup[] = [];
  constructor(
    private activeModal: NgbActiveModal,
    private confirm: ConfirmModalService,
    private groupService: GroupService,
    private userService: UserService,
    private translate: TranslateService,
    public sharedService: SharedService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.data = this.isEditPatient ? this.groupDetail.patients : this.groupDetail.hcps;

    this.directive.data = this.data;
  }

  /**
   * handle when close button is clicked
   */
  public clickedClose(): void {
    this.activeModal.close('Notify click');
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
   * @returns - The
   */
  public get groupSelectedString(): string | undefined {
    if (this.groupSelected.length === 0) {
      return this.translate.instant('none selected');
    }
    if (this.groupSelected.length > 3) {
      return this.translate.instant(':param selected', { param: this.groupSelected.length });
    }
    return this.groupSelected.map((item) => item.group_name).join(',');
  }

  /**
   * @returns - The
   */
  public onSelectedGroupClicked($event: any, data: any) {
    if ($event.target.checked) {
      this.groupSelected.push(data);
    } else this.groupSelected = this.groupSelected.filter((item: any) => item != data);
  }

  /**
   * @returns - The
   */
  public isChecked(data: any): boolean {
    return !!this.groupSelected.find((item: any) => item == data);
  }

  /**
   * handle event when remove button is clicked
   */
  public onRemoveClicked(): void {
    if (!((this.isEditPatient && this.groupDetail.group_default) || this.directive.selectedRows.length === 0)) {
      let confirmMsg = this.isEditPatient
        ? 'do you want to remove the patient from :group?'
        : 'do you want to remove users from :group?';
      this.confirm.open(confirmMsg, { group: this.groupDetail.group_name }).subscribe(() => {
        let patientIdList = [];
        let hcpIdList = [];
        if (this.isEditPatient) {
          patientIdList = this.directive.selectedRows.map((patient: any) => patient.patient_id);
        } else {
          hcpIdList = this.directive.selectedRows.map((hcp: any) => hcp.hcp_id);
        }
        this.groupService
          .deleteMember({
            group_id: this.groupDetail.group_id,
            patients: patientIdList,
            hcps: hcpIdList,
          })
          .subscribe(
            () => {
              this.activeModal.dismiss();
            },
            (error: any) => {
              if (error.error.message.includes('have more than')) {
                this.toastService.show(this.translate.instant('error.too many items', { count: 500 }), {
                  className: 'bg-red-100',
                });
              } else if (error.error.message === 'group_id does not exist') {
                this.activeModal.close(error.error.message);
              } else if (error.error.message.includes('does not exist')) {
                let id = '';
                let field = '';
                if (this.isEditPatient) {
                  id = this.directive.selectedRows[error.error.field.split('.')[1]].patient_code;
                  field = this.translate.instant('patient') + ' ' + id;
                } else {
                  id = this.directive.selectedRows[error.error.field.split('.')[1]].hcp_code;
                  field = this.translate.instant('dr./nurse') + ' ' + id;
                }
                let mess = this.translate.instant(':field does not exist', { field: field });
                this.toastService.show(mess, { className: 'bg-red-100' });
              } else {
                this.toastService.show(this.translate.instant('error.server'), { className: 'bg-red-100' });
              }
            }
          );
      });
    }
  }

  /**
   * handle event when remove button is clicked
   */
  public onAddClicked(): void {
    if (this.directive.selectedRows.length && this.groupSelected.length) {
      this.confirm.open('do you want to add users to :group?', { group: this.groupSelectedString }).subscribe(() => {
        let selectedGroupIds = this.groupSelected.map((group) => group.group_id);
        let patientIdList = [];
        let hcpIdList = [];
        if (this.isEditPatient) {
          patientIdList = this.directive.selectedRows.map((patient: any) => patient.patient_id);
        } else {
          hcpIdList = this.directive.selectedRows.map((hcp: any) => hcp.hcp_id);
        }
        this.userService.addUser({ groups: selectedGroupIds, hcps: hcpIdList, patients: patientIdList }).subscribe(
          () => {
            this.activeModal.dismiss();
          },
          (error) => {
            if (error.error.message.includes('have more than')) {
              this.toastService.show(this.translate.instant('error.too many items', { count: 100 }), {
                className: 'bg-red-100',
              });
            } else if (error.error.message === 'group_id does not exist') {
              let field = this.translate.instant('Group');
              let mess = this.translate.instant(':field does not exist', { field: field });
              this.toastService.show(mess, { className: 'bg-red-100' });
            } else if (error.error.message.includes('does not exist')) {
              let id = this.directive.selectedRows[error.error.field.split('.')[1]].hcp_code;
              let field = this.translate.instant('dr./nurse') + ' ' + id;
              let mess = this.translate.instant(':field does not exist', { field: field });
              this.toastService.show(mess, { className: 'bg-red-100' });
            } else {
              this.toastService.show(this.translate.instant('error.server'), { className: 'bg-red-100' });
            }
          }
        );
      });
    }
  }
}
