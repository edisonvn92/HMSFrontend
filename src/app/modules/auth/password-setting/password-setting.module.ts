import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordSettingRoutingModule } from './password-setting-routing.module';
import { PasswordSettingComponent } from './password-setting.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [PasswordSettingComponent],
  imports: [CommonModule, PasswordSettingRoutingModule, SharedModule],
})
export class PasswordSettingModule {}
