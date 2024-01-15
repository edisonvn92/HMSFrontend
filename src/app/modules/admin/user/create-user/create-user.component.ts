import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '@shared/services/shared.service';
import { handleName, joinName } from '@shared/helpers';
import BaseValidators from '@shared/validators/base.validator';
import { HcpService } from '@services/admin/hcp.service';
import { TranslateService } from '@ngx-translate/core';
import { HospitalWithoutAdminService } from '@data/services/admin/hospital-without-admin.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  @ViewChild('hospitalDropdown', { static: false, read: NgbDropdown }) ngbHospitalDropdown!: NgbDropdown;

  public isCreate = true;
  public errMess = '';
  public validationErr = '';
  public hospitalId = '';
  public hcpId = '';
  public hospitalWithoutAdminList: any[] = [];
  public userForm = this.formBuilder.group(
    {
      hospital_id: [
        '',
        {
          validators: [Validators.required],
          updateOn: 'submit',
        },
      ],
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
      password_confirmation: [
        '',
        {
          validators: [Validators.required, Validators.maxLength(100)],
          updateOn: 'submit',
        },
      ],
    },
    {
      validators: [BaseValidators.passwordMatch('password', 'password_confirmation')],
    }
  );
  public isError = false;
  hospitalParam = { page: 1, limit: 1000, timezone_offset: new Date().getTimezoneOffset() };
  currentHospital: any = [];

  constructor(
    public formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    public sharedService: SharedService,
    private hcpService: HcpService,
    private translate: TranslateService,
    private hospitalWithoutAdminService: HospitalWithoutAdminService
  ) {}

  ngOnInit() {
    if (!this.isCreate) {
      forkJoin({
        hcp: this.hcpService.find({ hcp_id: this.hcpId }),
        hospitalList: this.hospitalWithoutAdminService.findMany(this.hospitalParam),
      }).subscribe(
        (data) => {
          this.hospitalWithoutAdminList = data.hospitalList.data;
          this.currentHospital = {
            hospital_id: data.hcp.hospital.hospital_id,
            hospital_name: data.hcp.hospital.hospital_name,
          };
          this.hospitalWithoutAdminList.unshift(this.currentHospital);
          this.userForm.patchValue({
            ...data.hcp,
            hcp_full_name: joinName(data.hcp.hcp_first_name, data.hcp.hcp_middle_name, data.hcp.hcp_last_name),
            hospital_id: data.hcp.hospital.hospital_id,
          });
          if (data.hospitalList.total > this.hospitalWithoutAdminList.length) {
            this.getHospitalWithoutAdminList(2);
          } else {
            this.sharedService.showLoadingEventEmitter.emit();
          }
        },
        (err) => {
          this.errMess = err.error.message ? err.error.message : this.translate.instant('error.server');
          this.sharedService.showLoadingEventEmitter.emit();
        }
      );
      this.userForm.controls.password.clearValidators();
      this.userForm.controls.password_confirmation.clearValidators();
      this.userForm.controls.password.updateValueAndValidity();
      this.userForm.controls.password_confirmation.updateValueAndValidity();
    } else {
      this.getHospitalWithoutAdminList();
    }
  }

  /**
   * function to get hospital without admin list
   */
  getHospitalWithoutAdminList(page: number = 1) {
    const params = { page: page, limit: 1000, timezone_offset: new Date().getTimezoneOffset() };
    this.hospitalWithoutAdminService.findMany(params).subscribe(
      (data: any) => {
        this.hospitalWithoutAdminList = this.hospitalWithoutAdminList.concat(data.data);
        if (page === 1) {
          this.userForm.patchValue({
            hospital_id: this.hospitalWithoutAdminList[0].hospital_id,
          });
          this.currentHospital = this.hospitalWithoutAdminList[0];
        }
        if (data.total > this.hospitalWithoutAdminList.length) {
          this.getHospitalWithoutAdminList(page + 1);
        } else {
          this.sharedService.showLoadingEventEmitter.emit();
        }
      },
      (err) => {
        this.sharedService.showLoadingEventEmitter.emit();
        this.errMess = err.error.message ? err.error.message : this.translate.instant('error.server');
      }
    );
  }

  /**
   * Handle event when user select hospital
   */
  public onSelectedHospitalClicked(data: any) {
    this.userForm.patchValue({
      hospital_id: data.hospital_id,
    });
    this.currentHospital = data;
    this.ngbHospitalDropdown.close();
  }

  /**
   * validate password and confirm password
   */
  public validatePass() {
    if (this.userForm.controls.password.value || this.userForm.controls.password_confirmation.value) {
      this.userForm.controls.password.setValidators([
        Validators.required,
        Validators.minLength(8),
        BaseValidators.passwordRules,
        BaseValidators.checkPasswordValidCharacter,
        Validators.maxLength(100),
      ]);
      this.userForm.controls.password_confirmation.setValidators([Validators.required, Validators.maxLength(100)]);
    } else {
      this.userForm.controls.password.clearValidators();
      this.userForm.controls.password_confirmation.clearValidators();
    }
    this.userForm.controls.password.updateValueAndValidity();
    this.userForm.controls.password_confirmation.updateValueAndValidity();
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
      this.validationErr = '';
      if (!this.isError) {
        let param = this.userForm.value;
        delete param.hcp_full_name;

        this.hcpService.create(param).subscribe(
          () => {
            this.activeModal.close();
          },
          (error) => {
            if (error.error.errorCode) {
              this.sharedService.showLoadingEventEmitter.emit(false);
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
    let name = handleName(data.trim());
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
      this.validationErr = '';
      if (!this.isError) {
        let param = JSON.parse(JSON.stringify(this.userForm.value));

        if (!param.password) {
          delete param.password;
          delete param.password_confirmation;
        }
        delete param.hcp_full_name;
        param.hcp_id = this.hcpId;

        this.hcpService.update(param).subscribe(
          () => {
            this.activeModal.close();
          },
          (error) => {
            if (error.error.errorCode) {
              if (error.error.message === 'hcp_id does not exist') {
                this.errMess = error.error.message;
              } else {
                this.isError = true;
                this.validationErr = error.error.message;
              }
            }
          }
        );
      }
    }, 0);
  }
}
