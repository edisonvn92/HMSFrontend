import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPatientBasicInfo } from '@models/patientDetail';
import { isToday, showDate } from '@shared/helpers';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-latest-medical-examination-date',
  templateUrl: './latest-medical-examination-date.component.html',
  styleUrls: ['./latest-medical-examination-date.component.scss'],
})
export class LatestMedicalExaminationDateComponent {
  @Input() patient!: IPatientBasicInfo;
  @Output() openMedical: EventEmitter<any> = new EventEmitter<any>();

  constructor(public sharedService: SharedService) {}

  /**
   *
   * show date
   */
  showDate() {
    return showDate(this.patient?.medical_register_utc_time, this.sharedService.isJa() ? 'YYYY/MM/DD' : 'D MMM YYYY');
  }

  /**
   *check today is vital_office_utc_time
   */
  isToday() {
    return isToday(this.patient?.medical_register_utc_time);
  }
}
