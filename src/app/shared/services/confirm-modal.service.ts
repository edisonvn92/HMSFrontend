import { EventEmitter, Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmModalService {
  constructor(private modalService: NgbModal) {}

  /**
   * Opens a modal confirm with type is confirm.
   *
   * @param text : content of the dialog
   * @returns : the vent Emitter
   */
  public open(text: string, params?: any): EventEmitter<void> {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      backdrop: 'static',
      windowClass: 'mt-135',
      modalDialogClass: 'w-417',
    });
    modalRef.componentInstance.setProperties(text, params);

    return modalRef.componentInstance.confirmClicked;
  }
}
