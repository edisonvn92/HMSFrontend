import { NgModule } from '@angular/core';

import { AdminForgotPasswordRoutingModule } from './admin-forgot-password-routing.module';
import { AdminForgotPasswordComponent } from './admin-forgot-password.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [AdminForgotPasswordComponent],
  imports: [SharedModule, AdminForgotPasswordRoutingModule],
})
export class AdminForgotPasswordModule {}
