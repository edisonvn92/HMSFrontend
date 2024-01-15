import { Component, Input } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import hospitalSetting from '@data/json/hospitalSetting.json';
import { of } from 'rxjs';

@Component({
  selector: 'app-setting-time',
  templateUrl: './setting-time.component.html',
  styleUrls: ['./setting-time.component.scss'],
})
export class SettingTimeComponent {
  @Input() setting: any;

  public hospitalSetting = hospitalSetting;
  public dayErr!: string;
  public nightErr!: string;
  public mask = [/[0-2０-２]/, /[0-9０-９]/, ':', /[0-5０-５]/, /[0-9０-９]/, ':', /[0-5０-５]/, /[0-9０-９]/];

  constructor(public sharedService: SharedService) {}

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
   * normalize text in setting to unicode text
   * @param field field of setting
   */
  normalizeText(field: string) {
    this.setting[field] = this.setting[field].normalize('NFKC');
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
   * handle event when submit button is clicked
   */
  onSubmit() {
    this.validate();

    if (!this.dayErr && !this.nightErr) {
      return of(this.setting);
    }
    return of(null);
  }
}
