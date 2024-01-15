import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EcgReportRoutingModule } from './ecg-report-routing.module';
import { EcgReportComponent } from './ecg-report.component';
import { EcgRecordResultComponent } from './ecg-summary-page/ecg-record-result/ecg-record-result.component';
import { SharedModule } from '@shared/shared.module';
import { EcgTrendAnalysisComponent } from './ecg-summary-page/ecg-trend-analysis/ecg-trend-analysis.component';
import { EcgSummaryPageComponent } from './ecg-summary-page/ecg-summary-page.component';
import { EcgRecordListPageComponent } from './ecg-record-list-page/ecg-record-list-page.component';
import { EcgPageHeaderComponent } from './ecg-page-header/ecg-page-header.component';

@NgModule({
  declarations: [
    EcgReportComponent,
    EcgRecordResultComponent,
    EcgTrendAnalysisComponent,
    EcgSummaryPageComponent,
    EcgRecordListPageComponent,
    EcgPageHeaderComponent,
  ],
  imports: [CommonModule, EcgReportRoutingModule, SharedModule],
})
export class EcgReportModule {}
