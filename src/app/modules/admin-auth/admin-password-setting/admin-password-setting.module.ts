import { NgModule } from '@angular/core';

import { AdminPasswordSettingRoutingModule } from './admin-password-setting-routing.module';
import { AdminPasswordSettingComponent } from './admin-password-setting.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [AdminPasswordSettingComponent],
  imports: [SharedModule, AdminPasswordSettingRoutingModule],
})
export class AdminPasswordSettingModule {}
