import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicineRoutingModule } from './medicine-routing.module';
import { MedicineComponent } from './medicine.component';
import { SharedModule } from '@shared/shared.module';
import { CreateMedicineComponent } from './create-medicine/create-medicine.component';

@NgModule({
  declarations: [MedicineComponent, CreateMedicineComponent],
  imports: [CommonModule, SharedModule, MedicineRoutingModule],
})
export class MedicineModule {}
