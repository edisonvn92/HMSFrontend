import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import Validators from '@shared/validators/base.validator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { PatientService } from '@services/doctor/patient.service';
import { planHasMedicineType } from '@shared/helpers/data';
import { ToastService } from '@shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { scrollToTop } from '@shared/helpers';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],
})
export class PrescriptionComponent implements OnInit, OnDestroy {
  public now = moment().format('yyyy-MM-DD');
  public drugListAll: Array<any> = [];
  public patientId!: string;
  public drugForm = this.formBuilder.group({
    patient_id: '',
    data: this.formBuilder.array([]),
  });
  public prescriptionTypes = [
    {
      type: 'morning',
      value: planHasMedicineType.MORNING,
    },
    {
      type: 'noon',
      value: planHasMedicineType.NOON,
    },
    {
      type: 'evening',
      value: planHasMedicineType.EVENING,
    },
    {
      type: 'bedtime',
      value: planHasMedicineType.BEDTIME,
    },
  ];
  public subscriptions: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    public sharedService: SharedService,
    private activeModal: NgbActiveModal,
    private patientService: PatientService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.drugForm.patchValue({
      patient_id: this.patientId,
    });
    this.getAllDrug();
  }

  ngOnDestroy() {
    this.sharedService.showLoadingEventEmitter.emit(false);
    this.subscriptions.unsubscribe();
  }

  /**
   * add new FormGroup for prescription
   */
  newPrescription(hasValidate: boolean = true) {
    return this.formBuilder.group({
      patient_medicine_plan_id: null,
      patient_medicine_plan_start_at: [
        this.now,
        {
          validators: [Validators.required],
          updateOn: 'submit',
        },
      ],
      patient_medicine_plan_end_at: [
        this.now,
        {
          validators: [Validators.required],
          updateOn: 'submit',
        },
      ],
      patient_medicine_plan_morning_status: hasValidate ? 1 : 0,
      patient_medicine_plan_morning_description: '',
      patient_medicine_morning_list_id: [
        [],
        {
          validators: hasValidate ? [Validators.required] : [],
          updateOn: 'submit',
        },
      ],
      morning_search_drug: '',
      morning_drug: '',
      morning_drug_filter: [JSON.parse(JSON.stringify(this.drugListAll))],
      morning_drug_list: [JSON.parse(JSON.stringify(this.drugListAll))],
      patient_medicine_plan_noon_status: hasValidate ? 1 : 0,
      patient_medicine_plan_noon_description: '',
      patient_medicine_noon_list_id: [
        [],
        {
          validators: hasValidate ? [Validators.required] : [],
          updateOn: 'submit',
        },
      ],
      noon_search_drug: '',
      noon_drug: '',
      noon_drug_filter: [JSON.parse(JSON.stringify(this.drugListAll))],
      noon_drug_list: [JSON.parse(JSON.stringify(this.drugListAll))],
      patient_medicine_plan_evening_status: hasValidate ? 1 : 0,
      patient_medicine_plan_evening_description: '',
      patient_medicine_evening_list_id: [
        [],
        {
          validators: hasValidate ? [Validators.required] : [],
          updateOn: 'submit',
        },
      ],
      evening_search_drug: '',
      evening_drug: '',
      evening_drug_filter: [JSON.parse(JSON.stringify(this.drugListAll))],
      evening_drug_list: [JSON.parse(JSON.stringify(this.drugListAll))],
      patient_medicine_plan_bedtime_status: hasValidate ? 1 : 0,
      patient_medicine_plan_bedtime_description: '',
      patient_medicine_bedtime_list_id: [
        [],
        {
          validators: hasValidate ? [Validators.required] : [],
          updateOn: 'submit',
        },
      ],
      bedtime_search_drug: '',
      bedtime_drug: '',
      bedtime_drug_filter: [JSON.parse(JSON.stringify(this.drugListAll))],
      bedtime_drug_list: [JSON.parse(JSON.stringify(this.drugListAll))],
    });
  }

  /**
   * clear form array
   */
  clearFormArray() {
    this.prescriptions.clear();
  }

  get prescriptions() {
    return this.drugForm.get('data') as FormArray;
  }

  /**
   * get all drug of hospital
   */
  getAllDrug() {
    this.subscriptions.add(
      this.patientService.getAllDrug({}).subscribe(
        (data: any) => {
          if (data) {
            this.drugListAll = data;
          }
          this.getDetailPrescription();
        },
        () => {
          this.sharedService.showLoadingEventEmitter.emit(false);
        }
      )
    );
  }

  /**
   * get detail prescription of patient
   */
  getDetailPrescription() {
    this.subscriptions.add(
      this.patientService
        .getDetailPrescription({
          patient_id: this.patientId,
        })
        .subscribe(
          (data: any) => {
            if (data && data.length) {
              this.clearFormArray();
              data.forEach((item: any) => {
                let value = item;
                this.prescriptionTypes.forEach((type: any) => {
                  value[`${type.type}_search_drug`] = '';
                  value[`${type.type}_drug_filter`] = JSON.parse(JSON.stringify(this.drugListAll)) || [];
                });

                if (item.plan_has_medicine && item.plan_has_medicine.length) {
                  this.prescriptionTypes.forEach((type: any) => {
                    let listDelete = item.plan_has_medicine
                      .filter(
                        (medicine: any) =>
                          medicine.hospital_medicine?.deleted_at && medicine.plan_has_medicine_type === type.value
                      )
                      .map((el: any) => {
                        delete el.hospital_medicine.deleted_at;
                        return el.hospital_medicine;
                      });

                    value[`${type.type}_drug_filter`] = listDelete
                      .concat(value[`${type.type}_drug_filter`])
                      .sort((a: any, b: any) => {
                        if (
                          String(a.hospital_medicine_name).toLowerCase() >
                          String(b.hospital_medicine_name).toLowerCase()
                        )
                          return 1;
                        else return -1;
                      });

                    value[`${type.type}_drug_list`] = JSON.parse(JSON.stringify(value[`${type.type}_drug_filter`]));

                    value[`patient_medicine_${type.type}_list_id`] = item.plan_has_medicine
                      .filter((medicine: any) => medicine.plan_has_medicine_type === type.value)
                      .map((el: any) => el.hospital_medicine.hospital_medicine_id);
                    value[`${type.type}_drug`] = this.displayDrugName(
                      value[`patient_medicine_${type.type}_list_id`],
                      value[`${type.type}_drug_list`]
                    );
                  });
                } else {
                  value.patient_medicine_morning_list_id = [];
                  value.patient_medicine_noon_list_id = [];
                  value.patient_medicine_evening_list_id = [];
                  value.patient_medicine_bedtime_list_id = [];
                }
                const plan: FormGroup = this.newPrescription(false);
                this.prescriptions.push(plan);
              });

              this.drugForm.patchValue({
                patient_id: this.patientId,
                data,
              });
            } else {
              this.addPrescription();
            }
            this.sharedService.showLoadingEventEmitter.emit(false);
          },
          () => {
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        )
    );
  }

  /**
   * handle when language is selected
   */
  handleSelectDrug(data: any, type: string, index: number): void {
    const valuePrescriptionAtIndex = this.prescriptions.at(index).value;
    const result = valuePrescriptionAtIndex[`patient_medicine_${type}_list_id`] || [];
    // remove element if it exists morning/noon/evening/bedtime_drugs
    const drugIndex = result.findIndex((item: any) => item === data.hospital_medicine_id);
    if (drugIndex === -1) {
      result.push(data.hospital_medicine_id);
    } else {
      result.splice(drugIndex, 1);
    }
    this.prescriptions.at(index).patchValue({ [`patient_medicine_${type}_list_id`]: result });

    if (valuePrescriptionAtIndex[`patient_medicine_plan_${type}_status`]) {
      this.prescriptions
        .at(index)
        .get([`patient_medicine_${type}_list_id`])
        ?.setValidators([Validators.required]);
    } else {
      this.prescriptions
        .at(index)
        .get([`patient_medicine_${type}_list_id`])
        ?.clearValidators();
    }
    this.prescriptions
      .at(index)
      .get([`patient_medicine_${type}_list_id`])
      ?.updateValueAndValidity();
    this.prescriptions.at(index).patchValue({
      [`${type}_drug`]: this.displayDrugName(
        valuePrescriptionAtIndex[`patient_medicine_${type}_list_id`],
        valuePrescriptionAtIndex[`${type}_drug_list`]
      ),
    });
  }

  /**
   * normalize data before submit
   */
  normalizeDataBeforeSubmit() {
    const valueForm = this.drugForm.value;
    valueForm.data.map((value: any) => {
      delete value.morning_drug_filter;
      delete value.morning_drug_list;
      delete value.morning_drug;
      delete value.morning_search_drug;
      delete value.noon_drug_filter;
      delete value.noon_drug_list;
      delete value.noon_drug;
      delete value.noon_search_drug;
      delete value.evening_drug_filter;
      delete value.evening_drug_list;
      delete value.evening_drug;
      delete value.evening_search_drug;
      delete value.bedtime_drug_filter;
      delete value.bedtime_drug_list;
      delete value.bedtime_drug;
      delete value.bedtime_search_drug;
      if (value.patient_medicine_plan_id === null) {
        delete value.patient_medicine_plan_id;
      }
    });
    return valueForm;
  }

  /**
   * handle error message
   * @param err
   */
  handleError(err: any): string {
    if (err.error.message) {
      if (err.error.message.includes('should not have duplicate items')) {
        return 'should not have duplicate items';
      }

      if (err.error.message.includes('has been removed from the admin')) {
        return this.translate.instant(':medicine has been removed from the admin.', {
          medicine: err.error.message.replace(' has been removed from the admin', ''),
        });
      }
      return err.error.message;
    }

    return this.translate.instant('error.server');
  }

  /**
   *
   * @returns handle when submit button is clicked
   */
  submitClicked(): void {
    if (!this.checkDisable()) {
      setTimeout(() => {
        const valueForm = this.normalizeDataBeforeSubmit();
        this.subscriptions.add(
          this.patientService.savePrescription(valueForm).subscribe(
            () => {
              this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
              this.sharedService.showLoadingEventEmitter.emit();
              this.activeModal.close();
            },
            (err: any) => {
              let errMessage = this.handleError(err);
              this.toastService.show(errMessage, { className: 'bg-red-100' });
              this.sharedService.showLoadingEventEmitter.emit();
            }
          )
        );
      }, 0);
    }
  }

  /**
   * handle when close button is clicked
   */
  clickedClose(): void {
    this.activeModal.dismiss();
  }

  /**
   * assign value when date change
   * @param dateInput
   * @param type
   * @param isStart
   * @param index
   */
  onDateChange(dateInput: any, type: string, isStart: boolean, index: number) {
    const date = moment(dateInput).format('yyyy-MM-DD');
    const valuePrescriptionAtIndex = this.prescriptions.at(index).value;
    const startDate = valuePrescriptionAtIndex.patient_medicine_plan_start_at;
    const endDate = valuePrescriptionAtIndex.patient_medicine_plan_end_at;

    if (isStart) {
      this.prescriptions.at(index).patchValue({
        [type]: date,
        patient_medicine_plan_end_at: moment(date).isAfter(endDate) ? date : endDate,
      });
    } else {
      this.prescriptions.at(index).patchValue({
        [type]: date,
        patient_medicine_plan_start_at: moment(date).isBefore(startDate) ? date : startDate,
      });
    }
  }

  /**
   * filter drug when keyup
   * @param type
   * @param index
   */
  filterDrug(type: string, index: number) {
    setTimeout(() => {
      const valuePrescriptionAtIndex = this.prescriptions.at(index).value;
      const searchValue = valuePrescriptionAtIndex[`${type}_search_drug`];
      const listDrugAll = valuePrescriptionAtIndex[`${type}_drug_list`];
      const filterDrugList =
        searchValue.length < 1
          ? listDrugAll
          : listDrugAll.filter(
              (v: any) => v.hospital_medicine_name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
            );
      this.prescriptions.at(index).patchValue({ [`${type}_drug_filter`]: filterDrugList });
    }, 100);
  }

  /**
   * add component
   */
  addPrescription() {
    scrollToTop('prescription-list');
    this.prescriptions.insert(0, this.newPrescription());
  }

  /**
   * remove component
   * @param index
   */
  removePrescription(index: number) {
    this.prescriptions.removeAt(index);
  }

  /**
   * handle name drug for dropdown
   * @param arrDrugId
   */
  displayDrugName(arrDrugId: Array<number>, listAll: any): string {
    return arrDrugId && arrDrugId.length
      ? listAll
          .filter((item: any) => arrDrugId.includes(item.hospital_medicine_id))
          .map((value: any) => value.hospital_medicine_name)
          .join(', ')
      : '';
  }

  changeStatus(type: string, index: number) {
    const valuePrescriptionAtIndex = this.prescriptions.at(index).value;
    const valueCheckbox = valuePrescriptionAtIndex[`patient_medicine_plan_${type}_status`];
    if (valueCheckbox) {
      this.prescriptions
        .at(index)
        .get([`patient_medicine_${type}_list_id`])
        ?.clearValidators();
    } else {
      this.prescriptions
        .at(index)
        .get([`patient_medicine_${type}_list_id`])
        ?.setValidators([Validators.required]);
    }
    this.prescriptions
      .at(index)
      .get([`patient_medicine_${type}_list_id`])
      ?.updateValueAndValidity();
    this.prescriptions.at(index).patchValue({ [`patient_medicine_plan_${type}_status`]: !valueCheckbox });
  }

  /**
   * check disable button save
   */
  checkDisable() {
    const valueForm = this.drugForm.value;
    const result = valueForm.data.filter((item: any) => {
      return (
        (item.patient_medicine_plan_morning_status && item.patient_medicine_morning_list_id.length) ||
        (item.patient_medicine_plan_noon_status && item.patient_medicine_noon_list_id.length) ||
        (item.patient_medicine_plan_evening_status && item.patient_medicine_evening_list_id.length) ||
        (item.patient_medicine_plan_bedtime_status && item.patient_medicine_bedtime_list_id.length)
      );
    });

    // invalid if status = 1 but drug list not have
    let invalidDrugList = false;
    valueForm.data.forEach((item: any) => {
      this.prescriptionTypes.forEach((type: any) => {
        if (
          !invalidDrugList &&
          item[`patient_medicine_plan_${type.type}_status`] &&
          !item[`patient_medicine_${type.type}_list_id`].length
        ) {
          invalidDrugList = true;
        }
      });
    });

    return !(this.drugForm.valid && (!valueForm.data.length || (!invalidDrugList && result.length)));
  }
}
