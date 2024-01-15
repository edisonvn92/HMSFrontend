import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationCompleteComponent } from './registration-complete.component';

const routes: Routes = [{ path: '', component: RegistrationCompleteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationCompleteRoutingModule {}
