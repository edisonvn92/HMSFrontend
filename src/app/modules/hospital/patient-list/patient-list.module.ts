import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientListRoutingModule } from './patient-list-routing.module';
import { PatientListComponent } from './patient-list.component';
import { SharedModule } from '@shared/shared.module';
import { EditPatientComponent } from './edit-patient/edit-patient.component';

@NgModule({
  declarations: [PatientListComponent, EditPatientComponent],
  imports: [CommonModule, PatientListRoutingModule, SharedModule],
})
export class PatientListModule {}
