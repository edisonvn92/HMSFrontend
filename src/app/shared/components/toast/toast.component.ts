import { Component, HostBinding, TemplateRef } from '@angular/core';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  /**
   * Sets the css classes on the DOM element (:host).
   */
  @HostBinding('class') classes = 'ngb-toasts';

  constructor(public toastService: ToastService) {}

  /**
   * checking if toast content is a custom template of string using instanceof
   *
   * @param toast - any type
   */
  isTemplate(toast: any) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
