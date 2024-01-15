import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appRowSelected]',
})
export class RowSelectedDirective {
  @Input() appRowSelected = '';

  public selectedRows: any = [];
  public data: any = new Array();
  public isCheckedAll = false;

  constructor() {}

  /**
   * @returns - The
   */
  public get indeterminate(): boolean {
    return this.selectedRows.length > 0 && this.selectedRows.length < this.data.length;
  }

  /**
   * @returns - The
   */
  public set setData(data: any) {
    this.data = data;
  }

  /**
   * @returns - The
   */
  public isChecked(data: any): boolean {
    return !!this.selectedRows.find((item: any) => item == data);
  }

  /**
   * @returns - The
   */
  public onSelectedRowClicked($event: any, data: any) {
    switch (this.appRowSelected) {
      case 'multi':
        if ($event.target.checked) {
          this.selectedRows.push(data);
        } else this.selectedRows = this.selectedRows.filter((item: any) => item != data);
        break;
      default:
        if ($event.target.checked) {
          this.selectedRows = [data];
        } else this.selectedRows = [];
    }
    this.isCheckedAll = this.data.length == this.selectedRows.length;
  }

  /**
   * @returns - The
   */
  public selectAllClicked($event: any) {
    if ($event.target.checked) {
      this.selectedRows = this.data;
      this.isCheckedAll = true;
    } else this.selectedRows = [];
  }
}
