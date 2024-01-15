import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IGroup } from '@data/models/group';
import { EditGroupAffiliationComponent } from '../edit-group-affiliation/edit-group-affiliation.component';
import { GroupService } from '@data/services/hospital/group.service';
import { SharedService } from '@shared/services/shared.service';
import { focusIn, joinName } from '@shared/helpers';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss'],
})
export class GroupDetailComponent implements OnInit {
  @HostBinding('hidden') hidden: boolean = false;
  @Output() emittedErr = new EventEmitter<any>();

  public groupDetail: IGroup = {
    group_default: 0,
    group_id: 0,
    group_name: '',
    hcps: [],
    other_groups: [],
    patients: [],
  };
  public group_id!: number;
  public errMess = '';

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private groupService: GroupService,
    public sharedService: SharedService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.errMess = '';
    this.groupService.find({ group_id: this.group_id }).subscribe(
      (data) => {
        this.sharedService.showLoadingEventEmitter.emit(false);
        this.groupDetail = data;
      },
      (err) => {
        this.errMess = err.error.message ? err.error.message : this.translate.instant('error.server');
      }
    );
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
   * handle when close button is clicked
   */
  public clickedClose(): void {
    if (this.errMess) {
      this.emittedErr.emit();
    }
    this.activeModal.close('Notify click');
  }

  /**
   * handle when Edit Group Affiliation button is clicked
   */
  public onEditGroupAffiliationClicked(isEditPatient: boolean = false): void {
    const modalRef = this.modalService.open(EditGroupAffiliationComponent, {
      size: 'lg',
      backdrop: 'static',
    });
    modalRef.componentInstance.isEditPatient = isEditPatient;
    this.hidden = true;
    modalRef.componentInstance.groupDetail = this.groupDetail;
    modalRef.closed.subscribe((message: string) => {
      this.hidden = false;
      if (message === 'group_id does not exist') {
        this.errMess = message;
      }
      focusIn('icon-close');
    });
    modalRef.dismissed.subscribe(() => {
      this.activeModal.dismiss();
    });
  }
}
