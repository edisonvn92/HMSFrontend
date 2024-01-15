import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasswordSettingComponent } from './password-setting.component';

const routes: Routes = [{ path: '', component: PasswordSettingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordSettingRoutingModule {}
