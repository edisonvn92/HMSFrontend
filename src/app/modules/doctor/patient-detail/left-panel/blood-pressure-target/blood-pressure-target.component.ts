import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPatientBasicInfo } from '@models/patientDetail';

@Component({
  selector: 'app-blood-pressure-target',
  templateUrl: './blood-pressure-target.component.html',
  styleUrls: ['./blood-pressure-target.component.scss'],
})
export class BloodPressureTargetComponent {
  @Input() patient!: IPatientBasicInfo;
  @Output() openBloodPressureTarget: EventEmitter<any> = new EventEmitter<any>();
}
