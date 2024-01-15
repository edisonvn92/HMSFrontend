import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientRequestAnalysisComponent } from './patient-request-analysis.component';

const routes: Routes = [{ path: '', component: PatientRequestAnalysisComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientRequestAnalysisRoutingModule {}
