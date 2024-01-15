import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: `
   button:not(.app-btn-click-blur-ignore),
   [appBtnClickBlur]
  `,
})
export class BtnClickBlurDirective {
  @HostListener('click') onClick() {
    (document.activeElement as HTMLElement).blur();
  }
}
