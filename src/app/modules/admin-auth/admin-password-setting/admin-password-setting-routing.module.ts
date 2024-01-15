import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPasswordSettingComponent } from './admin-password-setting.component';

const routes: Routes = [{ path: '', component: AdminPasswordSettingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPasswordSettingRoutingModule {}
