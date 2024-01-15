import { NgModule } from '@angular/core';

import { ShindenAdviceRegistrationFormRoutingModule } from './shinden-advice-registration-form-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ShindenAdviceRegisterFormComponent } from './shinden-advice-register-form/shinden-advice-register-form.component';
import { ShindenAdviceRegistrationFormComponent } from './shinden-advice-registration-form.component';
import { ShindenAdviceRegisterConfirmDataComponent } from './shinden-advice-register-confirm-data/shinden-advice-register-confirm-data.component';
import { PatientAnalysisNoteComponent } from './patient-analysis-note/patient-analysis-note.component';

@NgModule({
  declarations: [
    ShindenAdviceRegisterFormComponent,
    ShindenAdviceRegistrationFormComponent,
    ShindenAdviceRegisterConfirmDataComponent,
    PatientAnalysisNoteComponent,
  ],
  imports: [SharedModule, ShindenAdviceRegistrationFormRoutingModule],
})
export class ShindenAdviceRegistrationFormModule {}
