import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-group',
  templateUrl: './change-group.component.html',
  styleUrls: ['./change-group.component.scss'],
})
export class ChangeGroupComponent {
  @Input() selectedGroup!: number;
  @Output() emittedGroup = new EventEmitter<number>();

  public groupList: { group_id: number; group_name: string }[] = [];

  constructor(public activeModal: NgbActiveModal) {}

  /**
   * handle when close button is clicked
   */
  clickedClose(): void {
    this.emittedGroup.emit(this.selectedGroup);
    this.activeModal.close('Notify click');
  }

  /**
   * handle when group is selected
   * @param groupId
   */
  selectGroup(groupId: number): void {
    this.selectedGroup = groupId;
  }
}
