import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTransformSpace]',
})
export class TransformSpaceDirective {
  constructor(private el: ElementRef) {}

  /**
   * when input change, change the input text to replace all unicode space to space EN
   */
  @HostListener('blur')
  onChange() {
    let ele = this.el.nativeElement as HTMLInputElement;
    ele.value = (ele.value as string).replace(/[\s,]+/gu, ' ');
  }
}
