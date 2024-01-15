import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IGroup } from '@data/models/group';
import { GroupService } from '@data/services/hospital/group.service';
import { NgbActiveModal, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '@shared/services/shared.service';
import { roles } from '@shared/helpers/data';
import { handleName, joinName } from '@shared/helpers/index';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import BaseValidators from '@shared/validators/base.validator';
import { HcpService } from '@data/services/hospital/hcp.service';
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  @ViewChild('roleDropdown', { static: false, read: NgbDropdown }) ngbRoleDropdown!: NgbDropdown;
  @ViewChild('groupDropdown', { static: false, read: NgbDropdown }) ngbGroupDropdown!: NgbDropdown;

  public isCreate = true;
  public errMess = '';
  public validationErr = '';
  public hcp_id = '';
  public noRoleSetting = false;
  public formErr: any = { group_required: false };
  public groupList: IGroup[] = [];
  public roles = JSON.parse(JSON.stringify(roles));
  public groupSelected: IGroup[] = [];
  public userForm = this.formBuilder.group(
    {
      hcp_id: '',
      hcp_cognito_username: [
        '',
        {
          validators: [Validators.required, Validators.pattern('^[A-Za-z0-9._-]{4,50}$'), Validators.minLength(4)],
          updateOn: 'submit',
        },
      ],
      hcp_cognito_phone: [
        '',
        {
          validators: [Validators.minLength(8), Validators.pattern('^(\\+\\d{1,})$'), Validators.maxLength(16)],
          updateOn: 'submit',
        },
      ],
      hcp_first_name: [
        '',
        {
          validators: [Validators.required],
          updateOn: 'submit',
        },
      ],
      hcp_cognito_email: [
        '',
        {
          validators: [Validators.required, Validators.email],
          updateOn: 'submit',
        },
      ],
      hcp_middle_name: [''],
      hcp_last_name: [''],
      hcp_full_name: '',
      hcp_start_period_of_use: null,
      hcp_end_period_of_use: null,
      role_name: [
        '',
        {
          validators: [Validators.required],
          updateOn: 'submit',
        },
      ],
      groups: [
        [],
        {
          validators: [Validators.required],
          updateOn: 'submit',
        },
      ],
      password: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(8),
            BaseValidators.checkPasswordValidCharacter,
            BaseValidators.passwordRules,
            Validators.maxLength(100),
          ],
          updateOn: 'submit',
        },
      ],
      confirmPassword: [
        '',
        {
          validators: [Validators.required, Validators.maxLength(100)],
          updateOn: 'submit',
        },
      ],
    },
    {
      validators: [BaseValidators.passwordMatch('password', 'confirmPassword')],
    }
  );
  public isError = false;

  constructor(
    public formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    public sharedService: SharedService,
    private groupService: GroupService,
    private translate: TranslateService,
    private hcpService: HcpService
  ) {}

  ngOnInit(): void {
    this.getListGroup();
    if (!this.isCreate) {
      this.hcpService.find({ hcp_id: this.hcp_id }).subscribe(
        (data) => {
          this.userForm.patchValue({
            ...data,
            groups: data.groups.map((item: any) => item.group_id),
            hcp_full_name: joinName(data.hcp_first_name, data.hcp_middle_name, data.hcp_last_name),
            role_name: data.roles[0] && data.roles[0].role_name,
          });
          this.sharedService.showLoadingEventEmitter.emit();
          this.groupSelected = data.groups;
        },
        (err) => {
          this.errMess = err.error.message ? err.error.message : this.translate.instant('error.server');
          this.sharedService.showLoadingEventEmitter.emit();
        }
      );

      this.userForm.controls.password.clearValidators();
      this.userForm.controls.confirmPassword.clearValidators();
      this.userForm.controls.password.updateValueAndValidity();
      this.userForm.controls.confirmPassword.updateValueAndValidity();
    } else {
      this.userForm.patchValue({
        role_name: this.roles[0].role_name,
      });
    }
  }

  /**
   * @returns - The string of group selected
   */
  public get groupSelectedString(): string | undefined {
    if (this.groupSelected.length === 0) {
      return this.translate.instant('none selected');
    }

    if (this.groupSelected.length === this.groupList.length) {
      return this.translate.instant('all selected');
    }

    if (this.groupSelected.length > 3) {
      return this.translate.instant(':param selected', { param: this.groupSelected.length });
    }

    return this.groupSelected.map((item) => item.group_name).join(', ');
  }

  /**
   * @returns - true when checkbox is checked, false otherwise
   */
  public isChecked(data: any): boolean {
    return !!this.groupSelected.find((item: any) => item.group_id == data.group_id);
  }

  /**
   * @returns -  check status check all in list group
   */
  public checkAll(): void {
    if (this.groupSelected.length !== this.groupList.length) {
      this.groupSelected = this.groupList;
    } else this.groupSelected = [];
    this.userForm.patchValue({
      groups: this.groupSelected.map((item: any) => item.group_id),
    });
  }

  /**
   * Handle event when user checked checkbox
   */
  public onSelectedGroupClicked($event: any, data: any) {
    if ($event.target.checked) {
      this.groupSelected.push(data);
    } else this.groupSelected = this.groupSelected.filter((item: any) => item.group_id != data.group_id);

    this.userForm.patchValue({
      groups: this.groupSelected.map((item: any) => item.group_id),
    });
  }

  /**
   * Handle event when user select role
   */
  public onSelectedRoleClicked(data: any) {
    this.userForm.patchValue({
      role_name: data.role_name,
    });
    this.ngbRoleDropdown.close();
  }

  /**
   * validate password and confirm password
   */
  public validatePass() {
    if (this.userForm.controls.password.value || this.userForm.controls.confirmPassword.value) {
      this.userForm.controls.password.setValidators([
        Validators.required,
        Validators.minLength(8),
        BaseValidators.passwordRules,
        BaseValidators.checkPasswordValidCharacter,
        Validators.maxLength(100),
      ]);
      this.userForm.controls.confirmPassword.setValidators([Validators.required, Validators.maxLength(100)]);
    } else {
      this.userForm.controls.password.clearValidators();
      this.userForm.controls.confirmPassword.clearValidators();
    }
    this.userForm.controls.password.updateValueAndValidity();
    this.userForm.controls.confirmPassword.updateValueAndValidity();
  }

  /**
   * Handle event when user  input date
   */
  public onDateChange(dateInput: any, type: string) {
    var date = moment(dateInput).format('yyyy-MM-DD');

    var endDate = this.userForm.controls.hcp_end_period_of_use.value;
    var startDate = this.userForm.controls.hcp_start_period_of_use.value;
    if (type === 'start') {
      this.userForm.patchValue({
        hcp_start_period_of_use: date,
        hcp_end_period_of_use: moment(date).isAfter(endDate) ? date : endDate,
      });
    } else {
      this.userForm.patchValue({
        hcp_start_period_of_use: moment(date).isBefore(startDate) ? date : startDate,
        hcp_end_period_of_use: date,
      });
    }
  }

  /**
   * set defaultDate when date picker is clicked
   */
  setDefaultDate(isReset: boolean = false): void {
    if (isReset) {
      this.userForm.patchValue({
        hcp_start_period_of_use: null,
        hcp_end_period_of_use: null,
      });
    } else if (
      !this.userForm.controls.hcp_end_period_of_use.value &&
      !this.userForm.controls.hcp_start_period_of_use.value
    ) {
      this.userForm.patchValue({
        hcp_start_period_of_use: moment().format('yyyy-MM-DD'),
        hcp_end_period_of_use: moment().add(6, 'months').format('yyyy-MM-DD'),
      });
    }
  }

  /**
   * get list Group
   */
  public getListGroup(page: number = 1) {
    var params = { page: page, limit: 1000 };

    this.groupService.findMany(params).subscribe((data) => {
      this.groupList = this.groupList.concat(data.data);
      if (this.isCreate) {
        this.groupSelected = this.groupList;
      }
      this.userForm.patchValue({
        groups: this.groupSelected.map((item: any) => item.group_id),
      });
      if (data.total > this.groupList.length) {
        this.getListGroup(page + 1);
      } else if (this.isCreate) {
        this.sharedService.showLoadingEventEmitter.emit(false);
      }
    });
  }

  /**
   * handle when close button is clicked
   */
  clickedClose(): void {
    this.activeModal.dismiss('Notify click');
  }

  /**
   *
   * @returns handle when submit button is clicked
   */
  submitClicked(): void {
    return this.isCreate ? this.createClicked() : this.updateClicked();
  }

  /**
   * handle when close button is clicked
   */
  createClicked(): void {
    setTimeout(() => {
      this.handleName(this.userForm.controls.hcp_full_name.value);
      this.isError = !this.userForm.valid;
      this.formErr.group_required = this.userForm.controls.groups.errors?.required;
      this.validationErr = '';
      if (!this.isError) {
        let param = this.userForm.value;

        this.hcpService.create(param).subscribe(
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
    }, 0);
  }

  /**
   * handle when create button is clicked
   */
  handleName(data: any): void {
    var name = handleName(data.trim());
    this.userForm.patchValue({
      hcp_first_name: name[0],
      hcp_middle_name: name[1],
      hcp_last_name: name[2],
    });
  }

  /**
   * handle when update button is clicked
   */
  updateClicked(): void {
    setTimeout(() => {
      this.validatePass();
      this.handleName(this.userForm.controls.hcp_full_name.value);
      this.isError = !this.userForm.valid;
      this.formErr.group_required = this.userForm.controls.groups.errors?.required;
      this.validationErr = '';
      if (!this.isError) {
        let param = this.userForm.value;

        if (!param.password) {
          delete param.password;
        }

        this.hcpService.update(param).subscribe(
          () => {
            this.activeModal.close();
          },
          (error) => {
            if (error.error.errorCode) {
              if (error.error.message === 'hcp not found') {
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
    }, 0);
  }
}
