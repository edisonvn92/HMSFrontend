import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender',
})
export class GenderPipe implements PipeTransform {
  /**
   *
   * @param value - number type includes 0 | 1
   * @returns - string value
   */
  transform(value: number): string {
    switch (value) {
      case 0:
        return 'female';
      case 1:
        return 'male';
      default:
        return '-';
    }
  }
}
