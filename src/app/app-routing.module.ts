import { PatientContentComponent } from './layouts/patient-content/patient-content.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './layouts/auth/auth.component';
import { HospitalContentComponent } from '@layout/hospital-content/hospital-content.component';
import { DoctorContentComponent } from '@layout/doctor-content/doctor-content.component';
import { NotLoggedGuard } from '@core/guards/not-logged.guard';
import { AuthenticationGuard } from '@core/guards/authentication.guard';
import { role } from '@shared/helpers/data';
import { RoleGuard } from '@core/guards/role.guard';
import { ReportComponent } from '@layout/report/report.component';
import { PatientAppContentComponent } from '@layout/patient-app-content/patient-app-content.component';
import { ShindenRegistrationComponent } from '@layout/shinden-registration/shinden-registration.component';
import { AdminAuthComponent } from '@layout/admin-auth/admin-auth.component';
import { AdminContentComponent } from '@layout/admin-content/admin-content.component';
import { AdminAuthenticationGuard } from '@core/guards/admin-authentication.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [NotLoggedGuard],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
        data: { title: 'login' },
      },
      {
        path: 'login',
        loadChildren: () => import('./modules/auth/login/login.module').then((m) => m.LoginModule),
        data: { title: 'login' },
      },
      {
        path: 'forgot-password',
        loadChildren: () =>
          import('./modules/auth/forgot-password/forgot-password.module').then((m) => m.ForgotPasswordModule),
        data: { title: 'forgot password title' },
      },
      {
        path: 'password-setting',
        loadChildren: () =>
          import('./modules/auth/password-setting/password-setting.module').then((m) => m.PasswordSettingModule),
        data: { title: 'password setting title' },
      },
    ],
  },
  {
    path: 'doctor',
    component: DoctorContentComponent,
    data: { expectedRole: [role.doctor, role.nurse] },
    canActivate: [AuthenticationGuard, RoleGuard],
    children: [
      {
        path: 'patient',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./modules/doctor/patient-list/patient-list.module').then((m) => m.PatientListModule),
            data: { title: 'patient list' },
          },
          {
            path: ':id',
            loadChildren: () =>
              import('./modules/doctor/patient-detail/patient-detail.module').then((m) => m.PatientDetailModule),
            data: { title: 'patient details' },
          },
        ],
      },
      {
        path: 'alert-list',
        loadChildren: () => import('./modules/doctor/alert-list/alert-list.module').then((m) => m.AlertListModule),
        data: { title: 'alert list' },
      },
      {
        path: 'change-password',
        loadChildren: () =>
          import('./modules/change-password/change-password.module').then((m) => m.ChangePasswordModule),
        data: { title: 'change password' },
      },
      {
        path: 'patient-request-analysis',
        loadChildren: () =>
          import('./modules/doctor/patient-request-analysis/patient-request-analysis.module').then(
            (m) => m.PatientRequestAnalysisModule
          ),
        data: { title: 'ecg analysis request' },
      },
      // All your other routes should come first, page-not-found is always at the end of router
      {
        path: 'page-not-found',
        loadChildren: () => import('./modules/page-not-found/page-not-found.module').then((m) => m.PageNotFoundModule),
        data: { title: 'page not found' },
      },
      { path: '**', redirectTo: 'page-not-found' }, // Wildcard route for a 404 page
    ],
  },
  {
    path: 'hospital',
    component: HospitalContentComponent,
    data: { expectedRole: [role.hospital] },
    canActivate: [AuthenticationGuard, RoleGuard],
    children: [
      {
        path: 'home',
        loadChildren: () => import('./modules/hospital/home/home.module').then((m) => m.HomeModule),
        data: { title: 'home' },
      },
      {
        path: 'group-list',
        loadChildren: () => import('./modules/hospital/group-list/group-list.module').then((m) => m.GroupListModule),
        data: { title: 'group management' },
      },
      {
        path: 'patient-list',
        loadChildren: () =>
          import('./modules/hospital/patient-list/patient-list.module').then((m) => m.PatientListModule),
        data: { title: 'patient management' },
      },
      {
        path: 'user-list',
        loadChildren: () => import('./modules/hospital/user-list/user-list.module').then((m) => m.UserListModule),
        data: { title: 'user management' },
      },
      {
        path: 'setting-blood-threshold',
        loadChildren: () =>
          import('./modules/hospital/setting-blood-threshold/setting-blood-threshold.module').then(
            (m) => m.SettingBloodThresholdModule
          ),
        data: { title: 'setting blood threshold' },
      },
      {
        path: 'setting-alert',
        loadChildren: () =>
          import('./modules/hospital/setting-alert/setting-alert.module').then((m) => m.SettingAlertModule),
        data: { title: 'setting alert' },
      },
      {
        path: 'setting-time',
        loadChildren: () =>
          import('./modules/hospital/setting-time/setting-time.module').then((m) => m.SettingTimeModule),
        data: { title: 'setting time' },
      },
      {
        path: 'change-password',
        loadChildren: () =>
          import('./modules/change-password/change-password.module').then((m) => m.ChangePasswordModule),
        data: { title: 'change password' },
      },
      // All your other routes should come first, page-not-found is always at the end of router
      {
        path: 'page-not-found',
        loadChildren: () => import('./modules/page-not-found/page-not-found.module').then((m) => m.PageNotFoundModule),
        data: { title: 'page not found' },
      },
      { path: '**', redirectTo: 'page-not-found' }, // Wildcard route for a 404 page
    ],
  },
  {
    path: 'registration-site',
    component: PatientContentComponent,
    canActivate: [NotLoggedGuard],
    children: [
      {
        path: '',
        redirectTo: 'top',
        pathMatch: 'full',
      },
      {
        path: 'top',
        loadChildren: () =>
          import('./modules/registration-site/registration-top/registration-top.module').then(
            (m) => m.RegistrationTopModule
          ),
        data: { title: 'registration top' },
      },
      {
        path: 'complete',
        loadChildren: () =>
          import('./modules/registration-site/registration-complete/registration-complete.module').then(
            (m) => m.RegistrationCompleteModule
          ),
        data: { title: 'registration complete' },
      },
      {
        path: 'registration',
        loadChildren: () =>
          import('./modules/registration-site/registration/registration.module').then((m) => m.RegistrationInfoModule),
        data: { title: 'registration' },
      },
    ],
  },
  {
    path: 'admin/auth',
    component: AdminAuthComponent,
    canActivate: [NotLoggedGuard],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadChildren: () =>
          import('./modules/admin-auth/admin-login/admin-login.module').then((m) => m.AdminLoginModule),
        data: { title: 'login' },
      },
      {
        path: 'forgot-password',
        loadChildren: () =>
          import('./modules/admin-auth/admin-forgot-password/admin-forgot-password.module').then(
            (m) => m.AdminForgotPasswordModule
          ),
        data: { title: 'forgot password title' },
      },
      {
        path: 'password-setting',
        loadChildren: () =>
          import('./modules/admin-auth/admin-password-setting/admin-password-setting.module').then(
            (m) => m.AdminPasswordSettingModule
          ),
        data: { title: 'password setting title' },
      },
    ],
  },
  {
    path: 'admin',
    component: AdminContentComponent,
    data: { expectedRole: [role.system_admin] },
    canActivate: [AdminAuthenticationGuard, RoleGuard],
    children: [
      {
        path: '',
        redirectTo: 'hospital',
        pathMatch: 'full',
      },
      {
        path: 'hospital',
        loadChildren: () => import('./modules/admin/hospital/hospital.module').then((m) => m.HospitalModule),
      },
      {
        path: 'user',
        loadChildren: () => import('./modules/admin/user/user.module').then((m) => m.UserModule),
        data: { title: 'user management' },
      },
      {
        path: 'import-csv',
        loadChildren: () => import('./modules/admin/import-csv/import-csv.module').then((m) => m.ImportCsvModule),
        data: { title: 'import csv' },
      },
      {
        path: 'change-password',
        loadChildren: () =>
          import('./modules/change-password/change-password.module').then((m) => m.ChangePasswordModule),
        data: { title: 'change password' },
      },
      {
        path: 'medicine',
        loadChildren: () => import('./modules/admin/medicine/medicine.module').then((m) => m.MedicineModule),
        data: { title: 'medicine management' },
      },
      // All your other routes should come first, page-not-found is always at the end of router
      {
        path: 'page-not-found',
        loadChildren: () => import('./modules/page-not-found/page-not-found.module').then((m) => m.PageNotFoundModule),
        data: { title: 'page not found' },
      },
      { path: '**', redirectTo: 'page-not-found' }, // Wildcard route for a 404 page
    ],
  },
  {
    path: 'report',
    component: ReportComponent,
    data: { expectedRole: [role.doctor, role.nurse] },
    children: [
      {
        path: 'blood-pressure',
        loadChildren: () =>
          import('./modules/reports/blood-pressure-report/blood-pressure-report.module').then(
            (m) => m.BloodPressureReportModule
          ),
      },
      {
        path: 'ecg',
        loadChildren: () => import('./modules/reports/ecg-report/ecg-report.module').then((m) => m.EcgReportModule),
      },
    ],
  },
  {
    path: 'patient-app',
    component: PatientAppContentComponent,
    data: { isWebview: true },
    children: [
      {
        path: 'patient-graph',
        loadChildren: () =>
          import('./modules/patient-app/patient-graph/patient-graph.module').then((m) => m.PatientGraphModule),
      },
      {
        path: 'terms-of-use',
        loadChildren: () =>
          import('./modules/patient-app/terms-of-use/terms-of-use.module').then((m) => m.TermsOfUseModule),
      },
      { path: 'auth', loadChildren: () => import('./modules/patient-app/auth/auth.module').then((m) => m.AuthModule) },
    ],
  },
  {
    path: 'shinden-registration',
    component: ShindenRegistrationComponent,
    canActivate: [NotLoggedGuard],
    children: [
      {
        path: '',
        redirectTo: 'shinden-advice',
        pathMatch: 'full',
      },
      {
        path: 'shinden-advice',
        children: [
          {
            path: '',
            redirectTo: 'top',
            pathMatch: 'full',
          },
          {
            path: 'top',
            loadChildren: () =>
              import(
                './modules/shinden-registration/shinden-advice-registration/shinden-advice-registration-top/shinden-advice-registration-top.module'
              ).then((m) => m.ShindenAdviceRegistrationTopModule),
            data: { title: 'shinden advice registration top' },
          },
          {
            path: 'form',
            loadChildren: () =>
              import(
                './modules/shinden-registration/shinden-advice-registration/shinden-advice-registration-form/shinden-advice-registration-form.module'
              ).then((m) => m.ShindenAdviceRegistrationFormModule),
            data: { title: 'shinden advice registration form' },
          },
          {
            path: 'confirm',
            loadChildren: () =>
              import(
                './modules/shinden-registration/shinden-advice-registration/shinden-advice-registration-confirm/shinden-advice-registration-confirm.module'
              ).then((m) => m.ShindenAdviceRegistrationConfirmModule),
            data: { title: 'shinden advice registration confirm' },
          },
          {
            path: 'complete',
            loadChildren: () =>
              import(
                './modules/shinden-registration/shinden-advice-registration/shinden-advice-registration-complete/shinden-advice-registration-complete.module'
              ).then((m) => m.ShindenAdviceRegistrationCompleteModule),
            data: { title: 'shinden advice registration completed' },
          },
        ],
      },
    ],
  },
  // All your other routes should come first, page-not-found is always at the end of router
  {
    path: 'page-not-found',
    loadChildren: () => import('./modules/page-not-found/page-not-found.module').then((m) => m.PageNotFoundModule),
    data: { title: 'page not found' },
  },
  { path: '**', redirectTo: 'page-not-found' }, // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
