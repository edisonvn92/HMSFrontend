import { Component, Input } from '@angular/core';
import { IPatientBasicInfo } from '@models/patientDetail';
import { showDate } from '@shared/helpers';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-step-count',
  templateUrl: './step-count.component.html',
  styleUrls: ['./step-count.component.scss'],
})
export class StepCountComponent {
  @Input() patient!: IPatientBasicInfo;

  constructor(public sharedService: SharedService) {}

  /**
   * show date
   */
  showDate() {
    return showDate(this.patient?.user_stat_ldate, this.sharedService.isJa() ? 'YYYY/MM/DD' : 'D MMM YYYY');
  }
}
