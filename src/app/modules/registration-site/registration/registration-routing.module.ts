import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationInfoComponent } from './registration.component';

const routes: Routes = [{ path: '', component: RegistrationInfoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationInfoRoutingModule {}
