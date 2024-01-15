import { NgModule } from '@angular/core';

import { SettingTimeRoutingModule } from './setting-time-routing.module';
import { SettingTimeComponent } from './setting-time.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [SettingTimeComponent],
  imports: [SharedModule, SettingTimeRoutingModule],
})
export class SettingTimeModule {}
