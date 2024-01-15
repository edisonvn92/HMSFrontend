import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '@shared/services/shared.service';
import { FormBuilder } from '@angular/forms';
import { joinName } from '@shared/helpers';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-shinden-mail',
  templateUrl: './shinden-mail.component.html',
  styleUrls: ['./shinden-mail.component.scss'],
})
export class ShindenMailComponent implements OnInit {
  @Input() patient: any = {};

  public validationErr = '';
  public errMess = '';
  public isError = false;
  public joinName = joinName;
  public subject = '';
  public message = '';

  constructor(
    public modalService: NgbModal,
    public formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    if (this.patient.patient_analysis_emails.length) {
      this.subject = this.patient.patient_analysis_emails[0].patient_email.patient_email_subject;
      this.message = this.patient.patient_analysis_emails[0].patient_email.patient_email_message;
    }
  }

  /**
   * handle when close is clicked
   */
  clickedClose(): void {
    this.activeModal.dismiss();
  }
}
