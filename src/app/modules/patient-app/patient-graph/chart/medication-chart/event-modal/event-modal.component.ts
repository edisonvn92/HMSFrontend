import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss'],
})
export class EventModalComponent {
  @Input() popupHtml!: string;
  @Input() popupLocate!: string;
  @Input() popupIndex!: number;

  constructor() {}
}
