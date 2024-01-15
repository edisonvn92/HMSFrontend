import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientGraphRoutingModule } from './patient-graph-routing.module';
import { PatientGraphComponent } from './patient-graph.component';
import { BPChartComponent } from './chart/bp-chart/bp-chart.component';
import { MedicationChartComponent } from './chart/medication-chart/medication-chart.component';
import { EventModalComponent } from './chart/medication-chart/event-modal/event-modal.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [PatientGraphComponent, BPChartComponent, MedicationChartComponent, EventModalComponent],
  imports: [CommonModule, PatientGraphRoutingModule, SharedModule],
})
export class PatientGraphModule {}
