import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-label-column-table',
  templateUrl: './label-column-table.component.html',
  styleUrls: ['./label-column-table.component.scss'],
})
export class LabelColumnTableComponent {
  @Input() sortType!: string;
  @Input() label!: string;
  @Input() labelId!: string;
  @Input() active!: boolean;
  @Input() textCenter!: boolean;
  @Input() unit!: string;
  @Input() classSort!: string;
  @Input() spaceBetween!: boolean;
  @Output() sortEvent = new EventEmitter<any>();

  /**
   * Event when click sort in the label
   */
  public sort(): void {
    this.sortEvent.emit({ label_id: this.labelId });
  }
}
