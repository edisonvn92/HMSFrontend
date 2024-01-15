import { NgModule } from '@angular/core';

import { HospitalRoutingModule } from './hospital-routing.module';
import { HospitalComponent } from './hospital.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [HospitalComponent],
  imports: [HospitalRoutingModule, SharedModule],
})
export class HospitalModule {}
