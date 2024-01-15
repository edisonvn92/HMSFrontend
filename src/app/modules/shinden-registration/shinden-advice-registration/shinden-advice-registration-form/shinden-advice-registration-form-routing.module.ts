import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShindenAdviceRegistrationFormComponent } from './shinden-advice-registration-form.component';

const routes: Routes = [{ path: '', component: ShindenAdviceRegistrationFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShindenAdviceRegistrationFormRoutingModule {}
