import { Component, OnInit, ViewChild } from '@angular/core';
import { IGroup } from '@data/models/group';
import { GroupService } from '@data/services/hospital/group.service';
import { NgbActiveModal, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '@shared/services/shared.service';
import { gender, language, smartphone } from '@shared/helpers/data';
import { handleName, joinName } from '@shared/helpers/index';
import * as moment from 'moment';
import { FormBuilder, Validators } from '@angular/forms';
import { PatientService } from '@data/services/hospital/patient.service';
import { TranslateService } from '@ngx-translate/core';
import BaseValidators from '@shared/validators/base.validator';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.scss'],
})
export class EditPatientComponent implements OnInit {
  @ViewChild('sexDropdown', { static: false, read: NgbDropdown }) ngbSexDropdown!: NgbDropdown;
  @ViewChild('groupDropdown', { static: false, read: NgbDropdown }) ngbGroupDropdown!: NgbDropdown;
  @ViewChild('smartphoneDropdown', { static: false, read: NgbDropdown }) ngbSmartphoneDropdown!: NgbDropdown;
  @ViewChild('langDropdown', { static: false, read: NgbDropdown }) ngbLangDropdown!: NgbDropdown;

  public minDate = new Date('1-1-1900');
  public maxDate = new Date();
  public isEdit = true;
  public errMess = '';
  public validationErr = '';
  public validationMsg = {
    patientCodeRequired: false,
    groupRequired: false,
    birthdayRequired: false,
    genderRequired: false,
  };
  public account = '';
  public isError = false;
  public patientID!: string;
  public smartphone = JSON.parse(JSON.stringify(smartphone));
  public genders = JSON.parse(JSON.stringify(gender));
  public groupList: IGroup[] = [];
  public language = language;
  public groupSelected: IGroup[] = [];
  public selected = { patient_gender: '', smartphone: '' };
  public patientForm = this.formBuilder.group({
    patient_id: '',
    patient_code: [
      '',
      {
        validators: [Validators.pattern('^[A-Za-z0-9._-]{0,50}$')],
        updateOn: 'submit',
      },
    ],
    patient_use_ogsc_username: 0,
    patient_first_name: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'submit',
      },
    ],
    patient_middle_name: '',
    patient_last_name: '',
    patient_full_name: '',
    patient_birthday: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'submit',
      },
    ],
    patient_gender: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'submit',
      },
    ],
    patient_email: '',
    patient_phone: [
      '',
      {
        validators: [Validators.minLength(7), BaseValidators.checkFormattedMobile, Validators.maxLength(16)],
        updateOn: 'submit',
      },
    ],
    patient_arm_circumference: '',
    patient_smart_phone: 0,
    patient_os_version: '',
    patient_model: '',
    patient_start_period_of_use: '',
    patient_end_period_of_use: '',
    groups: [
      [],
      {
        validators: [Validators.required],
        updateOn: 'submit',
      },
    ],
    user: this.formBuilder.group({
      user_language: '',
    }),
  });

  constructor(
    public activeModal: NgbActiveModal,
    private groupService: GroupService,
    public sharedService: SharedService,
    public formBuilder: FormBuilder,
    public patientService: PatientService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.isEdit) {
      this.getListGroup();
    }
    this.patientService.find({ patient_id: this.patientID }).subscribe(
      (data) => {
        this.patientForm.patchValue({
          ...data,
          groups: data.groups.map((item: any) => {
            return { group_id: item.group_id };
          }),
          patient_full_name: joinName(data.patient_first_name, data.patient_middle_name, data.patient_last_name),
          patient_code: data.patient_use_ogsc_username ? '' : data.patient_code,
        });

        this.groupSelected = data.groups;

        if (!this.patientForm.controls.user.value.user_language) {
          this.patientForm.patchValue({ user: { user_language: 'en' } });
        }

        this.selected = {
          patient_gender: this.genders.find((item: any) => item.value === data.patient_gender)?.text,
          smartphone: this.smartphone.find((item: any) => item.id === data.patient_smart_phone)?.name || '',
        };

        if (!data.patient_use_ogsc_username) {
          this.patientForm.controls.patient_code.addValidators([Validators.required]);
        }
        this.account = data.user.user_ogsc_username;
        this.sharedService.showLoadingEventEmitter.emit();
      },
      (err) => {
        this.errMess = err.error.message ? err.error.message : this.translate.instant('error.server');
        this.sharedService.showLoadingEventEmitter.emit();
      }
    );
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
   * handle when create button is clicked
   */
  handleName(data: any): void {
    var name = handleName(data.trim());
    this.patientForm.patchValue({
      patient_first_name: name[0],
      patient_middle_name: name[1],
      patient_last_name: name[2],
    });
  }

  /**
   * Handle event when user  input date
   */
  public onDateChange(dateInput: any, type?: string) {
    var date = moment(dateInput).format('yyyy-MM-DD');

    if (type) {
      var endDate = this.patientForm.controls.patient_end_period_of_use.value;
      var startDate = this.patientForm.controls.patient_start_period_of_use.value;
      if (type === 'start') {
        this.patientForm.patchValue({
          patient_start_period_of_use: date,
          patient_end_period_of_use: moment(date).isAfter(endDate) ? date : endDate,
        });
      } else {
        this.patientForm.patchValue({
          patient_start_period_of_use: moment(date).isBefore(startDate) ? date : startDate,
          patient_end_period_of_use: date,
        });
      }
    } else
      this.patientForm.patchValue({
        patient_birthday: date,
      });
  }

  /**
   * Handles the event when the reset button is clicked.
   */
  public selectedItem(field: string, value: any, text: string = '') {
    switch (field) {
      case 'patient_smart_phone': {
        this.patientForm.patchValue({
          patient_smart_phone: value,
        });
        this.selected.smartphone = text;
        this.ngbSmartphoneDropdown.toggle();
        break;
      }
      case 'patient_gender': {
        this.patientForm.patchValue({
          patient_gender: value,
        });
        this.selected.patient_gender = text;
        this.ngbSexDropdown.toggle();
        break;
      }
      case 'user_language': {
        this.patientForm.patchValue({ user: { user_language: value } });
        this.ngbLangDropdown.close();
        break;
      }
      default: {
      }
    }
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
    this.patientForm.patchValue({
      groups: this.groupSelected.map((item: any) => {
        return {
          group_id: item.group_id,
        };
      }),
    });
  }

  /**
   * Handle event when user checked checkbox
   */
  public onSelectedGroupClicked($event: any, data: any) {
    if ($event.target.checked) {
      this.groupSelected.push(data);
    } else this.groupSelected = this.groupSelected.filter((item: any) => item.group_id != data.group_id);

    this.patientForm.patchValue({
      groups: this.groupSelected.map((item: any) => {
        return {
          group_id: item.group_id,
        };
      }),
    });
  }

  /**
   * handle event when reset button is clicked
   */
  resetDate(): void {
    this.patientForm.patchValue({
      patient_start_period_of_use: null,
      patient_end_period_of_use: null,
    });
  }

  /**
   * handle event when reset button is clicked
   */
  handleCheckbox(event: any): void {
    if (!event.target.checked) {
      this.patientForm.controls.patient_code.setValidators([
        Validators.required,
        Validators.pattern('^[A-Za-z0-9._-]{0,50}$'),
      ]);
      this.patientForm.controls.patient_code.updateValueAndValidity();
    } else {
      this.patientForm.controls.patient_code.clearValidators();
    }

    this.patientForm.patchValue({
      patient_code: '',
      patient_use_ogsc_username: event.target.checked ? 1 : 0,
    });
  }

  /**
   * get list Group
   */
  public getListGroup(page: number = 1) {
    var params = { page: page, limit: 100 };
    this.groupService.findMany(params).subscribe((data) => {
      this.groupList = this.groupList.concat(data.data);
      if (data.total > this.groupList.length) {
        this.getListGroup(page + 1);
      }
    });
  }

  /**
   *
   * @returns handle when submit button is clicked
   */
  submitClicked(): void {
    setTimeout(() => {
      this.handleName(this.patientForm.controls.patient_full_name.value);
      this.isError = this.patientForm.invalid;

      this.validationMsg.patientCodeRequired = this.patientForm.controls.patient_code.errors?.required;
      this.validationMsg.groupRequired = this.patientForm.controls.groups.errors?.required;
      this.validationMsg.genderRequired = this.patientForm.controls.patient_gender.errors?.required;
      this.validationMsg.birthdayRequired = this.patientForm.controls.patient_birthday.errors?.required;
      this.validationErr = '';
      if (!this.isError) {
        this.patientService.update(this.patientForm.value).subscribe(
          () => {
            this.activeModal.close();
          },
          (error) => {
            if (error.error.errorCode) {
              if (error.error.message === 'patient_id does not exist') {
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

  /**
   * handle when close button is clicked
   */
  clickedClose(): void {
    this.activeModal.dismiss('Notify click');
  }
}
