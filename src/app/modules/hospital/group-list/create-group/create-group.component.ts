import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GroupService } from '@data/services/hospital/group.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '@shared/services/shared.service';
import BaseValidators from '@shared/validators/base.validator';
import Validators from '@shared/validators/base.validator';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent implements OnInit {
  @Output() emittedErr = new EventEmitter<any>();

  public isCreate = true;
  public group_id!: number;
  public validationErr = '';
  public groupForm = this.formBuilder.group({
    group_name: [
      '',
      {
        validators: [Validators.required, BaseValidators.fileName, Validators.maxLength(255)],
        updateOn: 'submit',
      },
    ],
    group_description: [
      '',
      {
        validators: [Validators.maxLength(255)],
        updateOn: 'submit',
      },
    ],
  });
  public isError = false;
  public isGroupExits = false;
  public errMess = '';

  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private groupService: GroupService,
    public sharedService: SharedService,
    private translate: TranslateService
  ) {}
  ngOnInit(): void {
    this.isCreate = !this.group_id;
    this.errMess = '';
    if (!this.isCreate) {
      this.groupService.find({ group_id: this.group_id }).subscribe(
        (data) => {
          this.sharedService.showLoadingEventEmitter.emit(false);
          this.groupForm.patchValue({ group_name: data.group_name, group_description: data.group_description });
        },
        (err) => {
          this.errMess = err.error.message ? err.error.message : this.translate.instant('error.server');
        }
      );
    }
  }

  /**
   * handle when close button is clicked
   */
  clickedClose(): void {
    if (this.errMess) {
      this.emittedErr.emit();
    }
    this.activeModal.dismiss('Notify click');
  }

  submitClicked(): void {
    return this.isCreate ? this.createClicked() : this.updateClicked();
  }

  /**
   * handle when close button is clicked
   */
  createClicked(): void {
    setTimeout(() => {
      this.isError = !this.groupForm.valid;
      this.validationErr = '';
      if (!this.isError) {
        this.groupService.create(this.groupForm.value).subscribe(
          () => {
            this.activeModal.close();
          },
          (error) => {
            if (error.error.errorCode) {
              this.isError = true;
              this.validationErr = error.error.message;
            }
          }
        );
      }
    }, 10);
  }

  /**
   * handle when close button is clicked
   */
  updateClicked(): void {
    setTimeout(() => {
      this.isError = !this.groupForm.valid;
      this.validationErr = '';
      if (!this.isError) {
        this.groupService.update({ ...this.groupForm.value, group_id: this.group_id }).subscribe(
          () => {
            this.activeModal.close();
          },
          (error) => {
            if (error.error.errorCode) {
              if (error.error.message === 'group_id does not exist') {
                this.errMess = error.error.message;
              } else {
                this.isError = true;
                this.validationErr = error.error.message;
              }
              this.sharedService.showLoadingEventEmitter.emit(false);
            }
          }
        );
      }
    }, 10);
  }
}
