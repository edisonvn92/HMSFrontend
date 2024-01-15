import { Component, Input } from '@angular/core';
import { IPatientBasicInfo } from '@models/patientDetail';
import { showDate, fixNumber } from '@shared/helpers';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.scss'],
})
export class TemperatureComponent {
  @Input() patient: IPatientBasicInfo | any = {};

  constructor(public sharedService: SharedService) {}

  /**
   * show date
   */
  showDate() {
    return showDate(this.patient?.vital_temperature_utc_time, this.sharedService.isJa() ? 'YYYY/MM/DD' : 'D MMM YYYY');
  }

  /**
   * take numberFix digit after comma
   *
   * @param value - value need handle
   * @param numberFix -
   */
  public fixNumber(value: number, numberFix: number = 2): string {
    return fixNumber(value, numberFix);
  }
}
