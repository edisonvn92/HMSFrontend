import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-group-list',
  templateUrl: './user-group-list.component.html',
  styleUrls: ['./user-group-list.component.scss'],
})
export class UserGroupListComponent {
  public groupList: { group_id: number; group_name: string }[] = [];

  constructor(public activeModal: NgbActiveModal) {}

  /**
   * handle when close button is clicked
   */
  clickedClose(): void {
    this.activeModal.dismiss('Notify click');
  }
}
