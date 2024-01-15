import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';

import { CreateHospitalRoutingModule } from './create-hospital-routing.module';
import { CreateHospitalComponent } from './create-hospital.component';
import { BasicInfoComponent } from './components/basic-info/basic-info.component';
import { ComponentSettingComponent } from './components/component-setting/component-setting.component';
import { HospitalSettingComponent } from './components/hospital-setting/hospital-setting.component';
import { SettingTimeComponent } from './components/hospital-setting/setting-time/setting-time.component';
import { SettingRankingComponent } from './components/hospital-setting/setting-ranking/setting-ranking.component';
import { ComponentTableComponent } from './components/component-setting/component-table/component-table.component';
import { MailTemplateComponent } from './components/mail-template/mail-template.component';

@NgModule({
  declarations: [
    CreateHospitalComponent,
    BasicInfoComponent,
    ComponentSettingComponent,
    HospitalSettingComponent,
    SettingTimeComponent,
    SettingRankingComponent,
    ComponentTableComponent,
    MailTemplateComponent,
  ],
  imports: [SharedModule, CreateHospitalRoutingModule],
})
export class CreateHospitalModule {}
