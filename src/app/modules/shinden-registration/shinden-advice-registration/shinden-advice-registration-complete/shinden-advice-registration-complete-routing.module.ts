import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShindenAdviceRegistrationCompleteComponent } from './shinden-advice-registration-complete.component';

const routes: Routes = [{ path: '', component: ShindenAdviceRegistrationCompleteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShindenAdviceRegistrationCompleteRoutingModule {}
