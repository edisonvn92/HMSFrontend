import { Component, OnInit } from '@angular/core';
import { HospitalService } from '@data/services/hospital/hospital.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { convertTime } from '@shared/helpers';
import { SharedService } from '@shared/services/shared.service';
import hospitalSetting from '@data/json/hospitalSetting.json';

@Component({
  selector: 'app-help-detail-3',
  templateUrl: './help-detail-3.component.html',
  styleUrls: ['./help-detail-3.component.scss'],
})
export class HelpDetail3Component implements OnInit {
  public measurementStatus = [
    {
      icon: './assets/images/icon_heart_1.svg',
      text1: 'irregular heartbeat',
      text2: 'irregular rhythm has been detected during measurement',
    },
    {
      icon: './assets/images/icon_body_1.svg',
      text1: 'movement error',
      text2: 'error will appear if you talk or move your body during measurement',
    },
    {
      icon: './assets/images/cuff_winding_1.svg',
      text1: 'cuff error',
      text2: 'error will appear if the cuff is not applied correctly',
    },
  ];
  public symptom = [
    {
      icon: 'ic_heartbeat.svg',
      text: 'palpitation',
    },
    {
      icon: 'ic_dizzy.svg',
      text: 'dizzy',
    },
    {
      icon: 'ic_headache.svg',
      text: 'headache',
    },
    {
      icon: 'ic_fever.svg',
      text: 'hot flash',
    },
    {
      icon: 'ic_swelling.svg',
      text: 'swelling',
    },
    {
      icon: 'ic_cough.svg',
      text: 'cough',
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
