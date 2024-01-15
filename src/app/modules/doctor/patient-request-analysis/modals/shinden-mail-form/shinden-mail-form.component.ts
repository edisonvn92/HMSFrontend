import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { FormBuilder, Validators } from '@angular/forms';
import { joinName } from '@shared/helpers';
import { ShindenService } from '@services/doctor/shinden.service';
import { ToastService } from '@shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-shinden-mail-form',
  templateUrl: './shinden-mail-form.component.html',
  styleUrls: ['./shinden-mail-form.component.scss'],
})
export class ShindenMailFormComponent implements OnInit {
  @ViewChild('submitButton') submitButton!: ElementRef;
  @Input() patient: any = {};
  @Input() patientMailList: any = {};
  @Input() isConfirm: boolean = false;
  @Output() closeModal = new EventEmitter<any>();

  public validationErr = '';
  public isError = false;
  public joinName = joinName;
  public mailForm = this.formBuilder.group({
    subject: [
      '',
      {
        validators: [Validators.required, Validators.maxLength(100)],
        updateOn: 'submit',
      },
    ],
    letter_body: [
      '',
      {
        validators: [Validators.required, Validators.maxLength(30000)],
        updateOn: 'submit',
      },
    ],
  });
  public inBounds = true;
  public edge = {
    top: true,
    bottom: true,
    left: true,
    right: true,
  };
  public isDraggable: boolean = true;

  constructor(
    public formBuilder: FormBuilder,
    public sharedService: SharedService,
    private shindenService: ShindenService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.isError = false;
    this.isConfirm = false;
    // patch value into the form if the email's data has been entered before and click the close button
    const oldMailForm = this.patientMailList.find((item: any) => {
      return item.patientAnalysisId === this.patient.patient_analysis_id;
    });
    if (oldMailForm) {
      this.mailForm.patchValue({
        ...oldMailForm.dataMail,
      });
    }
  }

  checkEdge(event: any) {
    this.edge = event;
  }

  /**
   * handle when close is clicked
   */
  clickedClose(): void {
    this.submitButton.nativeElement.click();
    setTimeout(() => {
      this.closeModal.emit({ dataMail: this.mailForm.value, patientAnalysisId: this.patient.patient_analysis_id });
    }, 0);
  }

  /**
   * handle confirm mail
   */
  confirmClicked(): void {
    setTimeout(() => {
      this.isError = !this.mailForm.valid;
      if (this.mailForm.valid) {
        this.isConfirm = true;
      }
    }, 0);
  }

  /**
   * handle submit mail
   */
  sendClicked(): void {
    setTimeout(() => {
      this.isError = !this.mailForm.valid;
      this.validationErr = '';
      if (this.mailForm.valid) {
        this.shindenService
          .shindenSendMail({
            patient_id: this.patient.patient_id,
            patient_analysis_id: this.patient.patient_analysis_id,
            subject: this.mailForm.value.subject,
            message: this.mailForm.value.letter_body,
          })
          .subscribe(
            () => {
              this.closeModal.emit({
                dataMail: this.mailForm,
                patientAnalysisId: this.patient.patient_analysis_id,
                submit: true,
              });
              this.sharedService.showLoadingEventEmitter.emit(false);
              this.toastService.show(this.translate.instant('email sent'), { className: 'bg-green-200' });
            },
            (error) => {
              if (error.error.errorCode) {
                this.isError = true;
                this.validationErr = error.error.message;
              }
              this.sharedService.showLoadingEventEmitter.emit(false);
            }
          );
      }
    }, 0);
  }

  /**
   * handle submit back
   */
  clickedBack() {
    this.isConfirm = false;
  }
}
