import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingTimeComponent } from './setting-time.component';

const routes: Routes = [{ path: '', component: SettingTimeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingTimeRoutingModule {}
