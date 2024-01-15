import { NgModule } from '@angular/core';

import { AdminLoginRoutingModule } from './admin-login-routing.module';
import { AdminLoginComponent } from './admin-login.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [AdminLoginComponent],
  imports: [AdminLoginRoutingModule, SharedModule],
})
export class AdminLoginModule {}
