import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateHospitalComponent } from './create-hospital.component';

const routes: Routes = [{ path: '', component: CreateHospitalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateHospitalRoutingModule {}
