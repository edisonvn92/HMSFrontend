import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserListRoutingModule } from './user-list-routing.module';
import { UserListComponent } from './user-list.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { CreateUserComponent } from './create-user/create-user.component';
import { UserGroupListComponent } from './user-group-list/user-group-list.component';

@NgModule({
  declarations: [UserListComponent, CreateUserComponent, UserGroupListComponent],
  imports: [CommonModule, UserListRoutingModule, NgbCollapseModule, SharedModule],
})
export class UserListModule {}
