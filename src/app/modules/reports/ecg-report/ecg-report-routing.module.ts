import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcgReportComponent } from './ecg-report.component';

const routes: Routes = [{ path: '', component: EcgReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EcgReportRoutingModule {}
