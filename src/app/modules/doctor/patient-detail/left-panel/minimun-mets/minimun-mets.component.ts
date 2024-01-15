import { Component, Input } from '@angular/core';
import { IPatientBasicInfo } from '@models/patientDetail';
import { showDate } from '@shared/helpers';
import { reviewMets } from '@shared/helpers/data';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-minimun-mets',
  templateUrl: './minimun-mets.component.html',
  styleUrls: ['./minimun-mets.component.scss'],
})
export class MinimunMetsComponent {
  @Input() patient: IPatientBasicInfo | any = {};

  public reviewMets = reviewMets;

  constructor(public sharedService: SharedService) {}

  /**
   * show date
   */
  showDate() {
    return showDate(this.patient?.patient_review_ldate, this.sharedService.isJa() ? 'YYYY/MM/DD' : 'D MMM YYYY');
  }
}
