import { Component, Input } from '@angular/core';
import { IPatientBasicInfo } from '@models/patientDetail';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-morning-home-blood-pressure',
  templateUrl: './morning-home-blood-pressure.component.html',
  styleUrls: ['./morning-home-blood-pressure.component.scss'],
})
export class MorningHomeBloodPressureComponent {
  @Input() patient!: IPatientBasicInfo;

  constructor(public sharedService: SharedService) {}
}
