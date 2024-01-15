import { Component, Input } from '@angular/core';
import { IPatientBasicInfo } from '@models/patientDetail';
import { showDate } from '@shared/helpers';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-heart-beat',
  templateUrl: './heart-beat.component.html',
  styleUrls: ['./heart-beat.component.scss'],
})
export class HeartBeatComponent {
  @Input() patient: IPatientBasicInfo | any = {};

  constructor(public sharedService: SharedService) {}

  /**
   * show date
   */
  showDate() {
    return showDate(
      this.patient?.patient_stat_heart_beat_ldate,
      this.sharedService.isJa() ? 'YYYY/MM/DD' : 'D MMM YYYY'
    );
  }
}
