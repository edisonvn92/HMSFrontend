import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingBloodThresholdComponent } from './setting-blood-threshold.component';

const routes: Routes = [{ path: '', component: SettingBloodThresholdComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingBloodThresholdRoutingModule {}
