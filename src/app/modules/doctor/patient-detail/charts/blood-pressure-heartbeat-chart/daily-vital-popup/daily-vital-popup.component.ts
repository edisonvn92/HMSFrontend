import { Component, Input } from '@angular/core';
import { fixNumber } from '@shared/helpers';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-daily-vital-popup',
  templateUrl: './daily-vital-popup.component.html',
  styleUrls: ['./daily-vital-popup.component.scss'],
})
export class DailyVitalPopupComponent {
  @Input() data: any;
  @Input() popupPosition: number = 0.5;
  constructor(public sharedService: SharedService) {}

  /**
   * get the date to show in the modal
   */
  get currentDate() {
    return this.data.patient_stat_ldate || this.data.vital_office_utc_time;
  }

  /**
   * set up position for pop up
   * @returns position for popup
   */
  getPopupPosition(): string {
    if (this.popupPosition < 0.5) {
      return `calc(${this.popupPosition * 100}% + 80px)`;
    } else return `calc(${this.popupPosition * 100}% - 460px)`;
  }

  /**
   * take numberFix digit after comma
   *
   * @param value - value need handle
   * @param numberFix -
   */
  public fixNumber(value: number, numberFix: number = 1): string {
    return fixNumber(value, numberFix);
  }
}
