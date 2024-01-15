import { Component, OnInit } from '@angular/core';
import { doctorMenuList } from '@shared/helpers/data';
import { SharedService } from '@shared/services/shared.service';
import { PatientService } from '@services/doctor/patient.service';
import { Router } from '@angular/router';
import { HospitalService } from '@services/hospital/hospital.service';

@Component({
  selector: 'app-doctor-content',
  templateUrl: './doctor-content.component.html',
  styleUrls: ['./doctor-content.component.scss'],
})
export class DoctorContentComponent implements OnInit {
  public doctorMenuList = doctorMenuList;
  mustCallHospitalSettingPages = ['/doctor/page-not-found'];

  constructor(
    public sharedService: SharedService,
    public patientService: PatientService,
    public router: Router,
    private hospitalService: HospitalService
  ) {}

  ngOnInit() {
    if (this.mustCallHospitalSettingPages.includes(this.router.url)) {
      this.getHospitalSetting();
    }
    this.getPatientBadgeNotification();
  }

  getPatientBadgeNotification() {
    this.patientService.getPatientBadgeNotification({}).subscribe(
      (data: any) => {
        this.sharedService.totalPatientHasAlert = data.alert_count || 0;
        this.sharedService.totalPatientAnalysisRequest = data.analysis_count || 0;
      },
      () => {
        this.sharedService.showLoadingEventEmitter.emit(false);
      }
    );
  }

  /**
   * get all info setting of hospital
   */
  getHospitalSetting() {
    this.hospitalService
      .getHospitalSetting({
        tables: ['hospital_setting', 'hospital_setting_functions'],
      })
      .subscribe(
        (data) => {
          this.sharedService.hospitalSetting = data;
          this.sharedService.showLoadingEventEmitter.emit(false);
        },
        () => {
          this.sharedService.showLoadingEventEmitter.emit(false);
        }
      );
  }
}
