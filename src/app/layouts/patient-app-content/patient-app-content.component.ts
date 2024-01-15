import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-patient-app-content',
  templateUrl: './patient-app-content.component.html',
  styleUrls: ['./patient-app-content.component.scss'],
})
export class PatientAppContentComponent implements OnDestroy {
  constructor() {
    document.body.className = 'into-patient-content';
  }

  ngOnDestroy() {
    document.body.className = '';
  }
}
