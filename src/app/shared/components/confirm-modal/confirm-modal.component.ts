import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent {
  @Output() confirmClicked = new EventEmitter<number>();

  /**
   * The message will be displayed in the alert.
   */
  public message!: string;

  /**
   * The param in message
   */
  public params?: any;

  constructor(public activeModal: NgbActiveModal) {}

  /**
   * handle when close button is clicked
   */
  clickedClose(): void {
    this.activeModal.close('Notify click');
  }

  /**
   * handle when confirm button is clicked
   */
  clickedConfirm(): void {
    this.confirmClicked.emit();
    this.activeModal.close('Notify click');
  }

  /**
   * Sets the values of component's properties before it is displayed.
   *
   * @param message - The message will be displayed in the alert.
   * @param params - The params will be displayed in the alert.
   */
  public setProperties(message: string, params?: any): void {
    [this.message, this.params] = [message, params];
  }
}
