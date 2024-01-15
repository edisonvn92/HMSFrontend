import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingAlertComponent } from './setting-alert.component';

const routes: Routes = [{ path: '', component: SettingAlertComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingAlertRoutingModule {}
