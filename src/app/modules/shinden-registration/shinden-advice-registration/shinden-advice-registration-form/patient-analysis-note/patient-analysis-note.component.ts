import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-patient-analysis-note',
  templateUrl: './patient-analysis-note.component.html',
  styleUrls: ['./patient-analysis-note.component.scss'],
})
export class PatientAnalysisNoteComponent {
  @Input() patient: any;
  @Output() confirmClicked: EventEmitter<any> = new EventEmitter();
  @Output() cancelClicked: EventEmitter<any> = new EventEmitter();

  maxLength: number = 30000;
  isError: boolean = false;

  constructor() {}

  /**
   * Handle event when confirm button is clicked
   */
  public onConfirmClicked() {
    window.scrollTo({ top: 0 });
    if (this.patient.note && this.patient.note.length > this.maxLength) {
      this.isError = true;
    } else {
      this.isError = false;
      this.confirmClicked.emit(this.patient);
    }
  }

  /**
   * Handle event when cancel button is clicked
   */
  public onCancelClicked() {
    window.scrollTo({ top: 0 });
    this.patient.note = '';
    this.cancelClicked.emit(this.patient);
  }
}
