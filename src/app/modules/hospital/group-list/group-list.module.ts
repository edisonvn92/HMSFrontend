import { NgModule } from '@angular/core';

import { GroupListRoutingModule } from './group-list-routing.module';
import { GroupListComponent } from './group-list.component';
import { SharedModule } from '@shared/shared.module';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { EditGroupAffiliationComponent } from './edit-group-affiliation/edit-group-affiliation.component';

@NgModule({
  declarations: [GroupListComponent, GroupDetailComponent, CreateGroupComponent, EditGroupAffiliationComponent],
  imports: [SharedModule, GroupListRoutingModule],
})
export class GroupListModule {}
