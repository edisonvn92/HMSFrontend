import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BloodPressureReportRoutingModule } from './blood-pressure-report-routing.module';
import { BloodPressureReportComponent } from './blood-pressure-report.component';
import { BloodPressureByDayTableComponent } from './blood-pressure-by-day-table/blood-pressure-by-day-table.component';
import { SharedModule } from '@shared/shared.module';
import { BloodPressureByMonthTableComponent } from './blood-pressure-by-month-table/blood-pressure-by-month-table.component';
import { BloodPressureByDayOfWeekTableComponent } from './blood-pressure-by-day-of-week-table/blood-pressure-by-day-of-week-table.component';

@NgModule({
  declarations: [
    BloodPressureReportComponent,
    BloodPressureByDayTableComponent,
    BloodPressureByDayOfWeekTableComponent,
    BloodPressureByMonthTableComponent,
  ],
  imports: [CommonModule, BloodPressureReportRoutingModule, SharedModule],
})
export class BloodPressureReportModule {}
