import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationTopComponent } from './registration-top.component';

const routes: Routes = [{ path: '', component: RegistrationTopComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationTopRoutingModule {}
