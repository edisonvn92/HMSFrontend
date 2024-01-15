import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPatientBasicInfo } from '@models/patientDetail';
import { showDate } from '@shared/helpers';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-latest-office-blood-pressure',
  templateUrl: './latest-office-blood-pressure.component.html',
  styleUrls: ['./latest-office-blood-pressure.component.scss'],
})
export class LatestOfficeBloodPressureComponent {
  @Input() patient: IPatientBasicInfo | any = {};
  @Output() openOfficeBloodPressure: EventEmitter<any> = new EventEmitter<any>();
  @Output() openOfficeBloodPressureHistory: EventEmitter<any> = new EventEmitter<any>();

  constructor(public sharedService: SharedService) {}

  /**
   * show date
   */
  showDate() {
    return showDate(this.patient?.vital_office_utc_time, this.sharedService.isJa() ? 'YYYY/MM/DD' : 'D MMM YYYY');
  }
}
