import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dash',
})
export class DashPipe implements PipeTransform {
  /**
   * show - when no data
   *
   * @param value - string | number type
   */
  transform(value?: string | number): string | number {
    if (!value && value !== 0) return '-';
    return value;
  }
}
