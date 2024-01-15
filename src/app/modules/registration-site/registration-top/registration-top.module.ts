import { NgModule } from '@angular/core';

import { RegistrationTopRoutingModule } from './registration-top-routing.module';
import { RegistrationTopComponent } from './registration-top.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [RegistrationTopComponent],
  imports: [SharedModule, RegistrationTopRoutingModule],
})
export class RegistrationTopModule {}
