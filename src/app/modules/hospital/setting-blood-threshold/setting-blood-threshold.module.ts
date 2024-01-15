import { NgModule } from '@angular/core';

import { SettingBloodThresholdRoutingModule } from './setting-blood-threshold-routing.module';
import { SettingBloodThresholdComponent } from './setting-blood-threshold.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [SettingBloodThresholdComponent],
  imports: [SettingBloodThresholdRoutingModule, SharedModule],
})
export class SettingBloodThresholdModule {}
