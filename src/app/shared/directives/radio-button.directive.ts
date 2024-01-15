import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: `input[type='radio']:not(.custom-radio-ignore),[appRadioButton]`,
})
export class RadioButtonDirective implements OnInit {
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    const child = this.document.createElement('label');
    child.setAttribute('for', this.elementRef.nativeElement.id);
    child.className = `custom-radio-label ${this.elementRef.nativeElement.className}`;
    child.setAttribute('style', this.elementRef.nativeElement.attributes?.style?.value);
    if (!this.elementRef.nativeElement.disabled) {
      child.tabIndex = this.elementRef.nativeElement.attributes?.tabindex?.value || 0;
    }
    const parent = this.elementRef.nativeElement.parentElement;
    this.renderer.insertBefore(parent, child, this.elementRef.nativeElement.nextSibling, false);
  }
}
