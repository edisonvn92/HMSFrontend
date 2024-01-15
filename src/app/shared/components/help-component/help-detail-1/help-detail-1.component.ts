import hospitalSetting from '@data/json/hospitalSetting.json';
import { Component, OnInit } from '@angular/core';
import { HospitalService } from '@data/services/hospital/hospital.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { convertTime } from '@shared/helpers';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-help-detail-1',
  templateUrl: './help-detail-1.component.html',
  styleUrls: ['./help-detail-1.component.scss'],
})
export class HelpDetail1Component implements OnInit {
  public evaluations = [
    { star: 4, text: 'i was able to do it' },
    { star: 3, text: 'did it' },
    { star: 2, text: 'i did a little' },
    { star: 1, text: "i couldn't do much" },
    { star: 0, text: 'unanswered' },
  ];
  public bloodPressures = [
    {
      icon: './assets/images/blood_pressure_3.svg',
      text: 'achieved the target blood pressure value',
    },
    {
      icon: './assets/images/blood_pressure_2.svg',
      text: 'same as the target blood pressure value somewhat expensive',
    },
    {
      icon: './assets/images/blood_pressure_1.svg',
      text: 'higher than the target blood pressure value',
    },
    {
      icon: './assets/images/blood_pressure_0.svg',
      text: 'very high above the target blood pressure',
    },
  ];
  public measurementStatus = [
    {
      icon: './assets/images/icon_heart_1.svg',
      text1: 'patient.irregular pulse wave',
      text2: 'the pulse during measurement is not detected properly',
    },
    {
      icon: './assets/images/icon_body_1.svg',
      text1: 'with body movement',
      text2: 'i talked or moved during the measurement',
    },
    {
      icon: './assets/images/cuff_winding_1.svg',
      text1: 'cuff winding NG',
      text2: 'the cuff is not wrapped with the proper strength',
    },
  ];
  public lifeImprovements = [
    {
      icon: './assets/images/icon_sleep.svg',
      text: 'sleep',
    },
    {
      icon: './assets/images/icon_exercise.svg',
      text: 'motion',
    },
    {
      icon: './assets/images/icon_vegetable_intake.svg',
      text: 'vegetable intake',
    },
    {
      icon: './assets/images/icon_reduced_salt.svg',
      text: 'reduced salt',
    },
    {
      icon: './assets/images/icon_saving_sake.svg',
      text: 'sobriety',
    },
    {
      icon: './assets/images/icon_smoking.svg',
      text: 'no smoking',
    },
  ];

  public setting = {
    hospital_setting_end_evening: '',
    hospital_setting_end_morning: '',
    hospital_setting_start_evening: '',
    hospital_setting_start_morning: '',
  };

  constructor(
    public activeModal: NgbActiveModal,
    public sharedService: SharedService,
    private hospitalService: HospitalService
  ) {}

  ngOnInit(): void {
    var param = {
      tables: ['hospital_setting'],
    };
    this.hospitalService.getHospitalSetting(param).subscribe((data) => {
      this.sharedService.showLoadingEventEmitter.emit(false);
      if (!data || !data.hospital_setting) {
        data.hospital_setting = hospitalSetting.default_hospital_setting_time;
      }
      this.setting = {
        hospital_setting_end_evening: convertTime(data.hospital_setting.hospital_setting_end_evening),
        hospital_setting_end_morning: convertTime(data.hospital_setting.hospital_setting_end_morning),
        hospital_setting_start_evening: convertTime(data.hospital_setting.hospital_setting_start_evening),
        hospital_setting_start_morning: convertTime(data.hospital_setting.hospital_setting_start_morning),
      };
    });
  }

  /**
   * handle when close button is clicked
   */
  public clickedClose(): void {
    this.activeModal.close('Notify click');
  }
}
