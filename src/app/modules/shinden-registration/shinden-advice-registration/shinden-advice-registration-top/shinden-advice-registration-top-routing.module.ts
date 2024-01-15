import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShindenAdviceRegistrationTopComponent } from './shinden-advice-registration-top.component';

const routes: Routes = [{ path: '', component: ShindenAdviceRegistrationTopComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShindenAdviceRegistrationTopRoutingModule {}
