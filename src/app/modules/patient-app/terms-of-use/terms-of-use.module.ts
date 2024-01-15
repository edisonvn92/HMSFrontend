import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsOfUseRoutingModule } from './terms-of-use-routing.module';
import { TermsOfUseComponent } from './terms-of-use.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [TermsOfUseComponent],
  imports: [CommonModule, TermsOfUseRoutingModule, SharedModule],
})
export class TermsOfUseModule {}
