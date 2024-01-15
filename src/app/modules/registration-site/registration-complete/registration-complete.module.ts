import { SharedModule } from '../../../shared/shared.module';
import { NgModule } from '@angular/core';

import { RegistrationCompleteRoutingModule } from './registration-complete-routing.module';
import { RegistrationCompleteComponent } from './registration-complete.component';

@NgModule({
  declarations: [RegistrationCompleteComponent],
  imports: [SharedModule, RegistrationCompleteRoutingModule],
})
export class RegistrationCompleteModule {}
