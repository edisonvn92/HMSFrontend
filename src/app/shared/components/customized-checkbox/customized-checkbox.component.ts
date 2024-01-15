import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-customized-checkbox',
  templateUrl: './customized-checkbox.component.html',
  styleUrls: ['./customized-checkbox.component.scss'],
})
export class CustomizedCheckboxComponent {
  @Input() checked: boolean = false;
  @Output() clickCheckbox = new EventEmitter<any>();

  constructor() {}
  /**
   * event when checkbox is clicked and change
   * @param event click event
   */
  onChangeCheckbox(event: any): void {
    // emit event to change input on parent component
    this.clickCheckbox.emit(event);
  }
}
