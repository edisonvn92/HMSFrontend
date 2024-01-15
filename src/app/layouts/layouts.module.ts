import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SharedModule } from '@shared/shared.module';
import { DoctorContentComponent } from './doctor-content/doctor-content.component';
import { HospitalContentComponent } from './hospital-content/hospital-content.component';
import { AppVersionComponent } from './sidebar/app-version/app-version.component';
import { PatientContentComponent } from './patient-content/patient-content.component';
import { ReportComponent } from './report/report.component';
import { PatientAppContentComponent } from './patient-app-content/patient-app-content.component';
import { ShindenRegistrationComponent } from './shinden-registration/shinden-registration.component';
import { AdminContentComponent } from './admin-content/admin-content.component';
import { AdminAuthComponent } from './admin-auth/admin-auth.component';
@NgModule({
  declarations: [
    AuthComponent,
    SidebarComponent,
    DoctorContentComponent,
    HospitalContentComponent,
    AppVersionComponent,
    PatientContentComponent,
    ReportComponent,
    PatientAppContentComponent,
    ShindenRegistrationComponent,
    AdminContentComponent,
    AdminAuthComponent,
  ],
  imports: [RouterModule, SharedModule],
})
export class LayoutsModule {}
