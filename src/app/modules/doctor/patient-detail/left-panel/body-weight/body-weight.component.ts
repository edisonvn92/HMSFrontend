import { Component, Input } from '@angular/core';
import { IPatientBasicInfo } from '@models/patientDetail';
import { showDate, fixNumber } from '@shared/helpers';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-body-weight',
  templateUrl: './body-weight.component.html',
  styleUrls: ['./body-weight.component.scss'],
})
export class BodyWeightComponent {
  @Input() patient: IPatientBasicInfo | any = {};

  constructor(public sharedService: SharedService) {}

  /**
   * take numberFix digit after comma
   *
   * @param value - value need handle
   * @param numberFix -
   */
  public fixNumber(value: number, numberFix: number = 1): string {
    return fixNumber(value, numberFix);
  }

  /**
   * show date
   */
  showDate() {
    return showDate(this.patient?.vital_weight_ldate, this.sharedService.isJa() ? 'YYYY/MM/DD' : 'D MMM YYYY');
  }
}
