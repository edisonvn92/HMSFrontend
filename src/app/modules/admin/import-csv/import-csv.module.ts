import { NgModule } from '@angular/core';

import { ImportCsvRoutingModule } from './import-csv-routing.module';
import { ImportCsvComponent } from './import-csv.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [ImportCsvComponent],
  imports: [SharedModule, ImportCsvRoutingModule],
})
export class ImportCsvModule {}
