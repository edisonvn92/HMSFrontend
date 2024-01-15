import { NgModule } from '@angular/core';

import { ShindenAdviceRegistrationConfirmRoutingModule } from './shinden-advice-registration-confirm-routing.module';
import { ShindenAdviceRegistrationConfirmComponent } from './shinden-advice-registration-confirm.component';
import { SharedModule } from '@shared/shared.module';
import { MailSentModalComponent } from './mail-sent-modal/mail-sent-modal.component';

@NgModule({
  declarations: [ShindenAdviceRegistrationConfirmComponent, MailSentModalComponent],
  imports: [SharedModule, ShindenAdviceRegistrationConfirmRoutingModule],
})
export class ShindenAdviceRegistrationConfirmModule {}
