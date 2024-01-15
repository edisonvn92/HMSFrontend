import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-help-detail-error',
  templateUrl: './help-detail-error.component.html',
  styleUrls: ['./help-detail-error.component.scss'],
})
export class HelpDetailErrorComponent {
  constructor(public activeModal: NgbActiveModal) {}

  /**
   * handle when close button is clicked
   */
  public clickedClose(): void {
    this.activeModal.close('Notify click');
  }
}
