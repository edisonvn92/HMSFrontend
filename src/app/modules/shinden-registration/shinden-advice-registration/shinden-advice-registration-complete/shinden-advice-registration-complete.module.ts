import { NgModule } from '@angular/core';

import { ShindenAdviceRegistrationCompleteRoutingModule } from './shinden-advice-registration-complete-routing.module';
import { ShindenAdviceRegistrationCompleteComponent } from './shinden-advice-registration-complete.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [ShindenAdviceRegistrationCompleteComponent],
  imports: [SharedModule, ShindenAdviceRegistrationCompleteRoutingModule],
})
export class ShindenAdviceRegistrationCompleteModule {}
