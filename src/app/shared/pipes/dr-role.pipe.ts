import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'drRole' })
export class DrRolePipe implements PipeTransform {
  /**
   * Transforms text
   *
   * @param value - boolean value
   * @returns - boolean text
   */
  public transform(value?: number): string {
    switch (value) {
      case 1:
        return 'Hospital Administrator';
      case 2:
        return 'Doctor';
      case 3:
        return 'Nurse';
      default:
        return '';
    }
  }
}
