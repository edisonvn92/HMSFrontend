import { NgModule } from '@angular/core';

import { PatientDetailRoutingModule } from './patient-detail-routing.module';
import { PatientDetailComponent } from './patient-detail.component';
import { SharedModule } from '@shared/shared.module';
import { MorningHomeBloodPressureComponent } from './left-panel/morning-home-blood-pressure/morning-home-blood-pressure.component';
import { EveningHomeBloodPressureComponent } from './left-panel/evening-home-blood-pressure/evening-home-blood-pressure.component';
import { StepCountComponent } from './left-panel/step-count/step-count.component';
import { TemperatureComponent } from './left-panel/temperature/temperature.component';
import { BodyWeightComponent } from './left-panel/body-weight/body-weight.component';
import { HeartBeatComponent } from './left-panel/heart-beat/heart-beat.component';
import { LatestMorningBloodPressureComponent } from './left-panel/latest-morning-blood-pressure/latest-morning-blood-pressure.component';
import { LatestOfficeBloodPressureComponent } from './left-panel/latest-office-blood-pressure/latest-office-blood-pressure.component';
import { BloodPressureTargetComponent } from './left-panel/blood-pressure-target/blood-pressure-target.component';
import { CalendarComponent } from './left-panel/calendar/calendar.component';
import { BloodPressureHeartbeatChartComponent } from './charts/blood-pressure-heartbeat-chart/blood-pressure-heartbeat-chart.component';
import { BloodPressureTargetModalComponent } from './modals/blood-pressure-target-modal/blood-pressure-target-modal.component';
import { LatestMedicalExaminationDateComponent } from './left-panel/latest-medical-examination-date/latest-medical-examination-date.component';
import { ConfirmExaminationDateComponent } from './left-panel/confirm-examination-date/confirm-examination-date.component';
import { MinimunMetsComponent } from './left-panel/minimun-mets/minimun-mets.component';
import { OfficeBloodPressureModalComponent } from './modals/office-blood-pressure-modal/office-blood-pressure-modal.component';
import { RankingHistoryModalComponent } from './modals/ranking-history-modal/ranking-history-modal.component';
import { BodyWeightHistoryModalComponent } from './modals/body-weight-history-modal/body-weight-history-modal.component';
import { HomeBloodPressureHistoryModalComponent } from './modals/home-blood-pressure-history-modal/home-blood-pressure-history-modal.component';
import { StepCountHistoryModalComponent } from './modals/step-count-history-modal/step-count-history-modal.component';
import { OfficeBloodPressureHistoryModalComponent } from './modals/office-blood-pressure-history-modal/office-blood-pressure-history-modal.component';
import { DailyVitalPopupComponent } from './charts/blood-pressure-heartbeat-chart/daily-vital-popup/daily-vital-popup.component';
import { BodyWeightChartComponent } from './charts/body-weight-chart/body-weight-chart.component';
import { PatientProfileComponent } from './modals/patient-profile/patient-profile.component';
import { StepCountChartComponent } from './charts/step-count-chart/step-count-chart.component';
import { DiaryChartComponent } from './charts/diary-chart/diary-chart.component';
import { HeartBeatHistoryModalComponent } from './modals/heart-beat-history-modal/heart-beat-history-modal.component';
import { LatestAlertComponent } from './left-panel/latest-alert/latest-alert.component';
import { SettingAlertModalComponent } from './modals/setting-alert-modal/setting-alert-modal.component';
import { DetailLatestAlertModalComponent } from './modals/detail-latest-alert-modal/detail-latest-alert-modal.component';
import { HeartFailureDrugUseChartComponent } from './charts/heart-failure-drug-use-chart/heart-failure-drug-use-chart.component';
import { SubjectiveSymptomChartComponent } from './charts/subjective-symptom-chart/subjective-symptom-chart.component';
import { MedicalModalComponent } from './modals/medical-modal/medical-modal.component';
import { MailChartComponent } from './charts/mail-chart/mail-chart.component';
import { AlertChartComponent } from './charts/alert-chart/alert-chart.component';
import { TemperatureBodyChartComponent } from './charts/temperature-body-chart/temperature-body-chart.component';
import { HeartBeatChartComponent } from './charts/heart-beat-chart/heart-beat-chart.component';
import { TemperatureHistoryModalComponent } from './modals/temperature-history-modal/temperature-history-modal.component';
import { AlertCommentModalComponent } from './charts/alert-chart/alert-comment-modal/alert-comment-modal.component';
import { NYHAChartComponent } from './charts/nyha-chart/nyha-chart.component';
import { BPMedicationChartComponent } from './charts/bp-medication-chart/bp-medication-chart.component';
import { ReviewHeartFailureComponent } from './charts/review-heart-failure/review-heart-failure.component';
import { MailReportComponent } from './left-panel/mail-report/mail-report.component';
import { HeartBeatReportComponent } from './left-panel/heart-beat-report/heart-beat-report.component';
import { ReportHistoryModalComponent } from './modals/report-history-modal/report-history-modal.component';
import { SelectMonthReportComponent } from './modals/select-month-report/select-month-report.component';
import { MessageHistoryModalComponent } from './modals/message-history-modal/message-history-modal.component';
import { PrescriptionComponent } from './modals/prescription/prescription.component';

@NgModule({
  declarations: [
    PatientDetailComponent,
    MorningHomeBloodPressureComponent,
    EveningHomeBloodPressureComponent,
    StepCountComponent,
    TemperatureComponent,
    BodyWeightComponent,
    HeartBeatComponent,
    LatestMorningBloodPressureComponent,
    LatestOfficeBloodPressureComponent,
    BloodPressureTargetComponent,
    CalendarComponent,
    BloodPressureHeartbeatChartComponent,
    LatestMedicalExaminationDateComponent,
    MinimunMetsComponent,
    BloodPressureTargetModalComponent,
    ConfirmExaminationDateComponent,
    OfficeBloodPressureModalComponent,
    RankingHistoryModalComponent,
    BodyWeightHistoryModalComponent,
    HomeBloodPressureHistoryModalComponent,
    StepCountHistoryModalComponent,
    OfficeBloodPressureHistoryModalComponent,
    DailyVitalPopupComponent,
    BodyWeightChartComponent,
    PatientProfileComponent,
    StepCountChartComponent,
    DiaryChartComponent,
    HeartBeatHistoryModalComponent,
    LatestAlertComponent,
    SettingAlertModalComponent,
    DetailLatestAlertModalComponent,
    HeartFailureDrugUseChartComponent,
    SubjectiveSymptomChartComponent,
    MedicalModalComponent,
    MailChartComponent,
    AlertChartComponent,
    TemperatureBodyChartComponent,
    HeartBeatChartComponent,
    TemperatureHistoryModalComponent,
    AlertCommentModalComponent,
    NYHAChartComponent,
    BPMedicationChartComponent,
    ReviewHeartFailureComponent,
    MailReportComponent,
    HeartBeatReportComponent,
    ReportHistoryModalComponent,
    SelectMonthReportComponent,
    MessageHistoryModalComponent,
    PrescriptionComponent,
  ],
  imports: [SharedModule, PatientDetailRoutingModule],
})
export class PatientDetailModule {}
