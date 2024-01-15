import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-patient-message-modal',
  templateUrl: './patient-message-modal.component.html',
  styleUrls: ['./patient-message-modal.component.scss'],
})
export class PatientMessageModalComponent {
  message: string = '';

  constructor(public modalService: NgbModal, public activeModal: NgbActiveModal) {}

  /**
   * handle when close is clicked
   */
  clickedClose(): void {
    this.activeModal.dismiss();
  }
}
