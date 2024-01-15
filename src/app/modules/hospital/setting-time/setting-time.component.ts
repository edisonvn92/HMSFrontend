import { HospitalSettingService } from '@data/services/hospital/hospital-setting.service';
import { HospitalService } from './../../../data/services/hospital/hospital.service';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import hospitalSetting from '@data/json/hospitalSetting.json';

@Component({
  selector: 'app-setting-time',
  templateUrl: './setting-time.component.html',
  styleUrls: ['./setting-time.component.scss'],
})
export class SettingTimeComponent implements OnInit {
  public setting: any = {
    hospital_setting_end_evening: '',
    hospital_setting_end_morning: '',
    hospital_setting_start_evening: '',
    hospital_setting_start_morning: '',
  };
  public hospitalSetting = hospitalSetting;
  public dayErr!: string;
  public nightErr!: string;
  public mask = [/[0-2０-２]/, /[0-9０-９]/, ':', /[0-5０-５]/, /[0-9０-９]/, ':', /[0-5０-５]/, /[0-9０-９]/];

  constructor(
    public sharedService: SharedService,
    private hospitalService: HospitalService,
    private hospitalSettingService: HospitalSettingService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    var param = {
      tables: ['hospital_setting'],
    };
    this.hospitalService.getHospitalSetting(param).subscribe(
      (data) => {
        if (data && data.hospital_setting) {
          this.setting.hospital_setting_end_evening = data.hospital_setting.hospital_setting_end_evening;
          this.setting.hospital_setting_start_evening = data.hospital_setting.hospital_setting_start_evening;
          this.setting.hospital_setting_end_morning = data.hospital_setting.hospital_setting_end_morning;
          this.setting.hospital_setting_start_morning = data.hospital_setting.hospital_setting_start_morning;
        } else {
          this.setting = this.hospitalSetting.default_hospital_setting_time;
        }
        this.sharedService.showLoadingEventEmitter.emit(false);
      },
      (err) => {
        let errMessage = err.error.message ? err.error.message : this.translate.instant('error.server');
        this.toastService.show(errMessage, { className: 'bg-red-100' });
        this.sharedService.showLoadingEventEmitter.emit();
      }
    );
  }

  /**
   * validate setting time
   */
  validate() {
    let dayErr = '';
    let nightErr = '';
    let endEvening = this.setting.hospital_setting_end_evening;
    let startEvening = this.setting.hospital_setting_start_evening;
    let endMorning = this.setting.hospital_setting_end_morning;
    let startMorning = this.setting.hospital_setting_start_morning;
    if (
      startMorning.indexOf('-') !== -1 ||
      endMorning.indexOf('-') !== -1 ||
      !endMorning ||
      !startMorning ||
      startMorning.split(':')[0] >= 24 ||
      endMorning.split(':')[0] >= 24
    )
      dayErr = 'invalid';
    if (
      startEvening.indexOf('-') !== -1 ||
      endEvening.indexOf('-') !== -1 ||
      !startEvening ||
      !endEvening ||
      startEvening.split(':')[0] >= 24 ||
      endEvening.split(':')[0] >= 24
    )
      nightErr = 'invalid';
    if (
      !dayErr &&
      (startMorning < this.hospitalSetting.hospital_setting_time.min_morning ||
        endMorning < this.hospitalSetting.hospital_setting_time.min_morning ||
        endMorning > this.hospitalSetting.hospital_setting_time.max_morning ||
        startMorning > this.hospitalSetting.hospital_setting_time.max_morning)
    ) {
      dayErr = 'between';
    }
    if (dayErr !== 'between' && endMorning <= startMorning) {
      dayErr = 'invalid';
    }

    if (
      !nightErr &&
      (this.convertNightTime(startEvening) < this.hospitalSetting.hospital_setting_time.min_evening ||
        this.convertNightTime(endEvening) < this.hospitalSetting.hospital_setting_time.min_evening ||
        this.convertNightTime(endEvening) > this.hospitalSetting.hospital_setting_time.max_evening ||
        this.convertNightTime(startEvening) > this.hospitalSetting.hospital_setting_time.max_evening)
    ) {
      nightErr = 'between';
    }
    if (nightErr !== 'between' && this.convertNightTime(endEvening) <= this.convertNightTime(startEvening)) {
      nightErr = 'invalid';
    }
    this.dayErr = dayErr;
    this.nightErr = nightErr;
  }

  /**
   * convert time in this time range
   */
  convertNightTime(time: string) {
    let hour = parseInt(time[0] + time[1]);
    let maxHour = parseInt(this.hospitalSetting.hospital_setting_time.min_morning.slice(0, 2)) + 1;

    return (hour > 24 ? '0' + (hour - 24) : hour < maxHour ? hour + 24 : hour) + time.slice(2);
  }

  /**
   * handle event when paste value
   */
  onPaste(event: any, field: string) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text').normalize('NFKC');
    if (pastedText.substring(0, 2) >= '24') {
      this.setting[field] = '';
    } else {
      this.setting[field] = pastedText;
    }
    event.preventDefault();
  }

  /**
   * normalize text in setting to unicode text
   * @param field field of setting
   */
  normalizeText(field: string) {
    this.setting[field] = this.setting[field].normalize('NFKC');
  }

  /**
   * handle event when submit button is clicked
   */
  onSubmit() {
    this.validate();

    if (!this.dayErr && !this.nightErr) {
      this.hospitalSettingService.update(this.setting).subscribe(
        () => {
          this.sharedService.showLoadingEventEmitter.emit(false);
          this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
        },
        (err) => {
          let errMessage = err.error.message ? err.error.message : this.translate.instant('error.server');
          this.toastService.show(errMessage, { className: 'bg-red-100' });
          this.sharedService.showLoadingEventEmitter.emit();
        }
      );
    }
  }
}
