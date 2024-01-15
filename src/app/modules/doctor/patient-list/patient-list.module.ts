import { NgModule } from '@angular/core';

import { PatientListRoutingModule } from './patient-list-routing.module';
import { PatientListComponent } from './patient-list.component';
import { SharedModule } from '@shared/shared.module';
import { ChangeGroupComponent } from './change-group/change-group.component';

@NgModule({
  declarations: [PatientListComponent, ChangeGroupComponent],
  imports: [SharedModule, PatientListRoutingModule],
})
export class PatientListModule {}
