import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-version',
  templateUrl: './app-version.component.html',
  styleUrls: ['./app-version.component.scss'],
})
export class AppVersionComponent {
  constructor(public activeModal: NgbActiveModal) {}

  /**
   * handle when close is clicked
   */
  clickedClose(): void {
    this.activeModal.close();
  }
}
