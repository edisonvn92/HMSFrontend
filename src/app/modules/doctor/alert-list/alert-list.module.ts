import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertListRoutingModule } from './alert-list-routing.module';
import { AlertListComponent } from './alert-list.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [AlertListComponent],
  imports: [CommonModule, AlertListRoutingModule, SharedModule],
})
export class AlertListModule {}
