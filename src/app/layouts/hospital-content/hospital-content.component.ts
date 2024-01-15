import { Component, OnInit } from '@angular/core';
import { hospitalMenuList, hospitalSettingList } from '@shared/helpers/data';
import { SharedService } from '@shared/services/shared.service';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-hospital-content',
  templateUrl: './hospital-content.component.html',
  styleUrls: ['./hospital-content.component.scss'],
})
export class HospitalContentComponent implements OnInit {
  public hospitalMenuList = hospitalMenuList;
  public hospitalSettingList = hospitalSettingList;
  public subscriptions: Subscription = new Subscription();

  constructor(public sharedService: SharedService, public authenticationService: AuthenticationService) {}

  ngOnInit() {
    const hospital = this.authenticationService.getCurrentUserInfo();
    if (!hospital || (hospital && !hospital.hospital?.hospital_setting?.hospital_setting_threshold_bp)) {
      this.hospitalSettingList = [hospitalSettingList[1], hospitalSettingList[2]];
    }
  }
}
