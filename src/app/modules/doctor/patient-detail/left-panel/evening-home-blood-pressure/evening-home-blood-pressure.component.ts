import { Component, Input } from '@angular/core';
import { IPatientBasicInfo } from '@models/patientDetail';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-evening-home-blood-pressure',
  templateUrl: './evening-home-blood-pressure.component.html',
  styleUrls: ['./evening-home-blood-pressure.component.scss'],
})
export class EveningHomeBloodPressureComponent {
  @Input() patient!: IPatientBasicInfo;

  constructor(public sharedService: SharedService) {}
}
