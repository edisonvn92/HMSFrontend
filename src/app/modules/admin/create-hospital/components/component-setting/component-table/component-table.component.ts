import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-component-table',
  templateUrl: './component-table.component.html',
  styleUrls: ['./component-table.component.scss'],
})
export class ComponentTableComponent implements OnChanges {
  @Input() components: any = [];
  @Input() id!: string;

  public isCheckAll = false;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.components && this.components && this.components.length) {
      let data = this.components.find((item: any) => {
        return !item.isActive;
      });
      this.isCheckAll = !data;
    }
  }

  /**
   * handle event when order event is called
   * @param index
   * @param isIncrease
   */
  orderComponent(index: number, isIncrease: boolean = false) {
    if (index >= 0 && index < this.components.length) {
      let component = this.components[index];

      if (isIncrease && index - 1 >= 0) {
        this.components[index] = JSON.parse(JSON.stringify(this.components[index - 1]));
        this.components[index].hospital_dashboard_order = component.hospital_dashboard_order;
        component.hospital_dashboard_order = this.components[index - 1].hospital_dashboard_order;
        this.components[index - 1] = component;
      } else if (!isIncrease && index + 1 < this.components.length) {
        this.components[index] = JSON.parse(JSON.stringify(this.components[index + 1]));
        this.components[index].hospital_dashboard_order = component.hospital_dashboard_order;
        component.hospital_dashboard_order = this.components[index + 1].hospital_dashboard_order;
        this.components[index + 1] = component;
      }
    }
  }

  /**
   * handle event when checkbox is clicked
   * @param index : number
   */
  onActiveComponent(index: number) {
    if (index >= 0 && index < this.components.length) {
      this.components[index].isActive = !this.components[index].isActive;
      let data = this.components.find((item: any) => !item.isActive);
      this.isCheckAll = !data;
    }
  }

  /**
   *handle event when button check all is clicked
   */
  onCheckAll() {
    let data = this.components.find((item: any) => !item.isActive);
    this.isCheckAll = !!data;
    this.components.map((item: any) => (item.isActive = !!data));
  }

  /**
   * handle event when submit button is clicked
   */
  onSubmit() {
    const component = this.components.filter((data: any) => {
      return data.isActive;
    });

    return of(component);
  }
}
