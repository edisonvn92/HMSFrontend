import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@data/services/authentication.service';
import { HospitalService } from '@data/services/hospital/hospital.service';
import { environment } from '@env/environment';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public registerSiteLink = `${environment.frontend_url}/registration-site/top?hospital_code=`;

  constructor(
    private authService: AuthenticationService,
    private hospitalService: HospitalService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    const hospitalCode = this.authService.getCurrentUserInfo().hospital.hospital_code;
    this.hospitalService
      .getHospitalSetting({
        tables: ['hospital_setting'],
      })
      .subscribe(
        (data) => {
          if (data.hospital_setting?.hospital_setting_shinden_report) {
            this.registerSiteLink = `${environment.frontend_url}/shinden-registration/shinden-advice/top?hospital_code=`;
          }
          this.registerSiteLink += hospitalCode;
          this.sharedService.showLoadingEventEmitter.emit(false);
        },
        () => {
          this.registerSiteLink += hospitalCode;
          this.sharedService.showLoadingEventEmitter.emit(false);
        }
      );
  }
}
