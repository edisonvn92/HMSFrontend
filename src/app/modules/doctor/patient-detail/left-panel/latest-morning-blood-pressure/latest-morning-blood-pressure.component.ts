import { Component, Input } from '@angular/core';
import { IPatientBasicInfo } from '@models/patientDetail';
import { showDate } from '@shared/helpers';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-latest-morning-blood-pressure',
  templateUrl: './latest-morning-blood-pressure.component.html',
  styleUrls: ['./latest-morning-blood-pressure.component.scss'],
})
export class LatestMorningBloodPressureComponent {
  @Input() patient: IPatientBasicInfo | any = {};

  constructor(public sharedService: SharedService) {}

  /**
   * show date
   */
  showDate() {
    return showDate(this.patient?.patient_stat_bp_ldate, this.sharedService.isJa() ? 'YYYY/MM/DD' : 'D MMM YYYY');
  }
}
