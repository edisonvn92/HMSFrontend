import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { PatientRequestAnalysisRoutingModule } from './patient-request-analysis-routing.module';
import { PatientRequestAnalysisComponent } from './patient-request-analysis.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { ShindenMailComponent } from './modals/shinden-mail/shinden-mail.component';
import { ShindenMailFormComponent } from './modals/shinden-mail-form/shinden-mail-form.component';
import { RequestAnalysisDetailComponent } from './modals/request-analysis-detail/request-analysis-detail.component';
import { PatientMessageModalComponent } from './modals/patient-message-modal/patient-message-modal.component';
import { PaymentConfirmationComponent } from './modals/payment-confirmation/payment-confirmation.component';

@NgModule({
  declarations: [
    PatientRequestAnalysisComponent,
    ShindenMailComponent,
    ShindenMailFormComponent,
    RequestAnalysisDetailComponent,
    PatientMessageModalComponent,
    PaymentConfirmationComponent,
  ],
  imports: [SharedModule, PatientRequestAnalysisRoutingModule, AngularDraggableModule],
})
export class PatientRequestAnalysisModule {}
