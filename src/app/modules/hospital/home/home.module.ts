import { NgModule } from '@angular/core';
import { ClipboardModule } from 'ngx-clipboard';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [SharedModule, HomeRoutingModule, ClipboardModule],
})
export class HomeModule {}
