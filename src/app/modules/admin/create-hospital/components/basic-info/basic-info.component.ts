import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import Validators from '@shared/validators/base.validator';
import { of } from 'rxjs';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss'],
})
export class BasicInfoComponent implements OnChanges {
  @Input() hospital: any;
  @Input() isCreate: boolean = false;
  @Input() error: string = '';
  @ViewChild('submitButton') submitButton!: ElementRef;

  public isError = false;
  public hospitalForm = this.formBuilder.group({
    hospital_code: [
      '',
      {
        validators: [Validators.required, Validators.maxLength(50), Validators.pattern('^[A-Za-z0-9._-]{1,50}$')],
        updateOn: 'submit',
      },
    ],
    hospital_name: [
      '',
      {
        validators: [Validators.required, Validators.maxLength(255)],
        updateOn: 'submit',
      },
    ],
    default_group: [
      '',
      {
        validators: [Validators.required, Validators.maxLength(255)],
        updateOn: 'submit',
      },
    ],
    hospital_address: '',
  });

  constructor(public formBuilder: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hospital && this.hospital) {
      this.hospitalForm.patchValue({
        hospital_code: this.hospital.hospital_code,
        hospital_name: this.hospital.hospital_name,
        hospital_address: this.hospital.hospital_address,
        default_group:
          this.hospital.groups && this.hospital.groups.length && this.hospital.groups[0]
            ? this.hospital.groups[0].group_name
            : '',
      });
    }
  }

  /**
   * handle event when submit button is clicked
   */
  onSubmit() {
    this.submitButton.nativeElement.click();
    this.isError = this.hospitalForm.invalid;
    if (!this.isError) {
      return of(this.hospitalForm.value);
    }
    return of(null);
  }
}
