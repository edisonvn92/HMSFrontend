import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MedicineService } from '@data/services/admin/medicine.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-create-medicine',
  templateUrl: './create-medicine.component.html',
  styleUrls: ['./create-medicine.component.scss'],
})
export class CreateMedicineComponent implements OnInit {
  public isCreate = true;
  public medicine_id!: number;
  public validationErr = '';
  public medicineForm = this.formBuilder.group({
    hospital_medicine_name: [
      '',
      {
        validators: [Validators.required, Validators.maxLength(255)],
        updateOn: 'submit',
      },
    ],
    hospital_medicine_description: '',
  });
  public isError = false;
  public isMedicineExits = false;
  public errMess = false;

  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    public sharedService: SharedService,
    public translate: TranslateService,
    public medicineService: MedicineService
  ) {}

  ngOnInit(): void {
    this.isCreate = !this.medicine_id;
    this.errMess = false;
    if (!this.isCreate) {
      this.medicineService.find({ hospital_medicine_id: this.medicine_id }).subscribe(
        (data) => {
          this.medicineForm.patchValue({
            hospital_medicine_name: data.hospital_medicine_name,
            hospital_medicine_description: data.hospital_medicine_description,
          });
          this.sharedService.showLoadingEventEmitter.emit(false);
        },
        (err) => {
          this.sharedService.showLoadingEventEmitter.emit(false);
          this.errMess = err.error.message ? true : false;
        }
      );
    }
  }

  /**
   * handle when close button is clicked
   */
  clickedClose(): void {
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
      this.isError = !this.medicineForm.valid;
      this.validationErr = '';
      if (!this.isError) {
        this.medicineService.create(this.medicineForm.value).subscribe(
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
      this.isError = !this.medicineForm.valid;
      this.validationErr = '';
      if (!this.isError) {
        this.medicineService.update({ ...this.medicineForm.value, hospital_medicine_id: this.medicine_id }).subscribe(
          () => {
            this.activeModal.close();
          },
          (error) => {
            if (error.error.errorCode) {
              if (error.error.message === 'hospital medicine not found') {
                this.errMess = true;
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
