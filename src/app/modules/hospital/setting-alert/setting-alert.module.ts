import { NgModule } from '@angular/core';

import { SettingAlertRoutingModule } from './setting-alert-routing.module';
import { SettingAlertComponent } from './setting-alert.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [SettingAlertComponent],
  imports: [SettingAlertRoutingModule, SharedModule],
})
export class SettingAlertModule {}
