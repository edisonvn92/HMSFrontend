import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminForgotPasswordComponent } from './admin-forgot-password.component';

const routes: Routes = [{ path: '', component: AdminForgotPasswordComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminForgotPasswordRoutingModule {}
