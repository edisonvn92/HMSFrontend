import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShindenAdviceRegistrationConfirmComponent } from './shinden-advice-registration-confirm.component';

const routes: Routes = [{ path: '', component: ShindenAdviceRegistrationConfirmComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShindenAdviceRegistrationConfirmRoutingModule {}
