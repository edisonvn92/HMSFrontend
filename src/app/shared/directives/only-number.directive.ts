import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appOnlyNumber]',
})
export class OnlyNumberDirective {
  @Input() phoneNumber: boolean = false;
  @Input() integer: boolean = false;
  constructor() {}

  @HostListener('keydown', ['$event']) onKeyDown(event: any) {
    let regexStr = !this.phoneNumber ? (this.integer ? /^[0-9]*$/ : /^[0-9.]*$/) : /^[+0-9]*$/;
    let e = <KeyboardEvent>event;
    let key = e.key;

    if (
      regexStr.test(key) ||
      ['Backspace', 'Home', 'Delete', 'Tab', 'End', 'Shift', 'ArrowLeft', 'ArrowRight', 'Enter'].indexOf(key) !== -1 ||
      e.ctrlKey == true
    )
      return;
    else e.preventDefault();
  }

  @HostListener('paste', ['$event']) onPaste(event: any) {
    let regexStr = !this.phoneNumber ? (this.integer ? /^[0-9]*$/ : /^[0-9.]*$/) : /^[+0-9]*$/;
    let e = <KeyboardEvent>event;
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');

    if (
      regexStr.test(pastedText) ||
      ['Backspace', 'Home', 'Delete', 'Tab', 'End', 'Shift', 'ArrowLeft', 'ArrowRight', 'Enter'].indexOf(pastedText) !==
        -1 ||
      e.ctrlKey == true
    )
      return;
    else e.preventDefault();
  }

  @HostListener('drop', ['$event']) onDrop(event: any) {
    event.preventDefault();
  }
}
