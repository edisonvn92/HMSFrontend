import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appSwipe]',
})
export class SwipeDirective {
  @Output() swipe: EventEmitter<any> = new EventEmitter<any>();

  private touchstartX = 0;
  private touchendX = 0;

  constructor() {}

  handleGesture() {
    if (this.touchendX < this.touchstartX) this.swipe.emit({ isSwipeLeft: true });
    if (this.touchendX > this.touchstartX) this.swipe.emit({ isSwipeLeft: false });
  }

  @HostListener('touchstart', ['$event'])
  touchstart = (e: any): void => {
    this.touchstartX = e.changedTouches[0].screenX;
  };

  @HostListener('touchend', ['$event'])
  touchend(e: any): void {
    this.touchendX = e.changedTouches[0].screenX;
    if (Math.abs(this.touchendX - this.touchstartX) > 100) this.handleGesture();
  }
}
