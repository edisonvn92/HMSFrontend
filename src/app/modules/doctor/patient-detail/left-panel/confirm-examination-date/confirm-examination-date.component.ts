import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-confirm-examination-date',
  templateUrl: './confirm-examination-date.component.html',
  styleUrls: ['./confirm-examination-date.component.scss'],
})
export class ConfirmExaminationDateComponent {
  @Output() confirmClicked = new EventEmitter<boolean>();

  public now = new Date();

  constructor(public activeModal: NgbActiveModal, public sharedService: SharedService) {}

  /**
   * handle when cancel button is clicked
   */
  clickedCancel(): void {
    this.activeModal.dismiss('Notify click');
  }

  /**
   * handle when confirm button is clicked
   */
  clickedConfirm(): void {
    this.confirmClicked.emit(true);
    this.activeModal.close('Notify click');
  }
}
