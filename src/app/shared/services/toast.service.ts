import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor() {}

  toasts: any[] = [];

  /**
   * Push new Toasts to array with content and options
   *
   * @param textOrTpl - string | TemplateRef<any>
   * @param options - {className: '', delay: 3000}
   */
  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    // using push if you want to show multiple toast
    this.toasts = [{ textOrTpl, ...options }];
  }

  /**
   * Remove an existing toast from the collection is also implemented
   *
   * @param toast - any
   */
  remove(toast: any) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}
