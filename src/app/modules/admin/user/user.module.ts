import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { CreateUserComponent } from './create-user/create-user.component';

@NgModule({
  declarations: [UserComponent, CreateUserComponent],
  imports: [SharedModule, UserRoutingModule],
})
export class UserModule {}
