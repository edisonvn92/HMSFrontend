import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HospitalComponent } from './hospital.component';

const routes: Routes = [
  {
    path: '',
    component: HospitalComponent,
    data: { title: 'list of medical institutions' },
  },
  {
    path: 'create',
    loadChildren: () => import('../create-hospital/create-hospital.module').then((m) => m.CreateHospitalModule),
    data: { title: 'create hospital' },
  },
  {
    path: 'edit',
    loadChildren: () => import('../create-hospital/create-hospital.module').then((m) => m.CreateHospitalModule),
    data: { title: 'edit hospital' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HospitalRoutingModule {}
