import { NgModule } from '@angular/core';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ForgotPasswordComponent } from './forgot-password.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [ForgotPasswordRoutingModule, SharedModule],
})
export class ForgotPasswordModule {}
