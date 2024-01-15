import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { RegistrationInfoRoutingModule } from './registration-routing.module';
import { RegistrationInfoComponent } from './registration.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { RegistrationConfirmComponent } from './registration-confirm/registration-confirm.component';

@NgModule({
  declarations: [RegistrationInfoComponent, RegistrationFormComponent, RegistrationConfirmComponent],
  imports: [SharedModule, RegistrationInfoRoutingModule],
})
export class RegistrationInfoModule {}
