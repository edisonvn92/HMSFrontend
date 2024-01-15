import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
@Component({
  selector: 'app-alert-comment-modal',
  templateUrl: './alert-comment-modal.component.html',
  styleUrls: ['./alert-comment-modal.component.scss'],
})
export class AlertCommentModalComponent implements OnChanges {
  @Input() data: any;
  @Input() popupPosition: number = 0.5;
  @Input() targetPosition = '0%';
  @Input() type: string = '';
  @Input() cellWidth = 0;
  @Input() period = 28;
  @Output() submitChange: EventEmitter<any> = new EventEmitter<any>();

  popupLocate = '';
  alertType = {
    alert_weight: 1,
    alert_low_bp: 2,
    alert_high_bp: 3,
    alert_ihb: 4,
    alert_af: 5,
  };
  patientId: string = '';
  shownData: any = {
    alert_diary_is_confirmed: 0,
    alert_diary_ldate: '',
    alert_diary_memo: null,
  };

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data && this.type.length > 0) {
      this.popupLocate = this.getPopupPosition();
      this.shownData = { ...this.data[this.type] };
    }
  }

  /**
   * set up position for pop up
   * @returns position for popup
   */
  getPopupPosition(): string {
    if (this.popupPosition < 0.5) {
      return `${this.popupPosition * this.cellWidth * this.period + 67}px`;
    } else return `${this.popupPosition * this.cellWidth * this.period - 130}px`;
  }

  /**
   * submit update when clicking button
   */
  updateChart() {
    if (this.shownData.alert_diary_is_confirmed) this.shownData.alert_diary_is_confirmed = 1;
    else this.shownData.alert_diary_is_confirmed = 0;
    if (this.shownData.alert_diary_memo == '') this.shownData.alert_diary_memo = null;
    this.shownData.alert_diary_ldate = this.data.alert_ldate;
    this.submitChange.emit(this.shownData);
  }
}
