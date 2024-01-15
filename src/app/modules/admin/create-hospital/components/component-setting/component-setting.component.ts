import { Component, Input, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { componentGroup } from './data';
import { ComponentTableComponent } from './component-table/component-table.component';
import { forkJoin } from 'rxjs';
import { componentType } from '@shared/helpers/data';
import { SharedService } from '@shared/services/shared.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-component-setting',
  templateUrl: './component-setting.component.html',
  styleUrls: ['./component-setting.component.scss'],
})
export class ComponentSettingComponent implements OnChanges {
  @ViewChildren('component') listComponent!: QueryList<ComponentTableComponent>;
  @Input() componentList: any;

  public componentGroup = componentGroup;
  public countComponent = 0;
  public dataResult: any = {
    rightPanel: [],
    leftPanel: [],
    list: [],
  };
  public components: any = {
    rightPanel: [],
    leftPanel: [],
    list: [],
  };

  constructor(public sharedService: SharedService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.componentList && this.componentList && this.componentList.length) {
      let lastOrder: any = 0;
      let components: any = {
        rightPanel: [],
        leftPanel: [],
        list: [],
      };
      this.componentList
        .sort((a: any, b: any) => {
          return a.hospital_dashboard_order - b.hospital_dashboard_order;
        })
        .forEach((data: any) => {
          if (lastOrder >= data.hospital_dashboard_order) {
            lastOrder++;
            data.hospital_dashboard_order = lastOrder;
          }

          if (data.component_type === componentType.LEFT_PANEL) {
            components.leftPanel.push({
              component_id: data.component_id,
              hospital_dashboard_order: data.hospital_dashboard_order,
              isActive: data.isActive,
              component_name: data.component_description,
            });
          } else if (data.component_type === componentType.RIGHT_PANEL) {
            components.rightPanel.push({
              component_id: data.component_id,
              hospital_dashboard_order: data.hospital_dashboard_order,
              isActive: data.isActive,
              component_name: data.component_description,
            });
          } else {
            components.list.push({
              component_id: data.component_id,
              hospital_dashboard_order: data.hospital_dashboard_order,
              isActive: data.isActive,
              component_name: data.component_description,
            });
          }
        });
      this.components = components;
    }
  }

  /**
   * handle event when submit button is clicked
   */
  onSubmit() {
    let components = this.listComponent.toArray();

    return forkJoin({
      list: components[0].onSubmit(),
      leftPanel: components[1].onSubmit(),
      rightPanel: components[2].onSubmit(),
    }).pipe(
      map((e: any) => {
        return [].concat(e.list, e.leftPanel, e.rightPanel);
      })
    );
  }
}
