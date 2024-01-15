import { NgModule } from '@angular/core';

import { ShindenAdviceRegistrationTopRoutingModule } from './shinden-advice-registration-top-routing.module';
import { ShindenAdviceRegistrationTopComponent } from './shinden-advice-registration-top.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [ShindenAdviceRegistrationTopComponent],
  imports: [SharedModule, ShindenAdviceRegistrationTopRoutingModule],
})
export class ShindenAdviceRegistrationTopModule {}
