import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { hospitalSetting } from './data';
import defaultSetting from '@data/json/hospitalSetting.json';
import { SettingTimeComponent } from './setting-time/setting-time.component';
import { SettingRankingComponent } from './setting-ranking/setting-ranking.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { scrollIntoView } from '@shared/helpers';

@Component({
  selector: 'app-hospital-setting',
  templateUrl: './hospital-setting.component.html',
  styleUrls: ['./hospital-setting.component.scss'],
})
export class HospitalSettingComponent implements OnChanges {
  @Input() isCreate: boolean = false;
  @Input() hospitalSetting: any;
  @Output() changeMailSetting = new EventEmitter();
  @ViewChild('time') settingTimeComponent!: SettingTimeComponent;
  @ViewChild('rank') settingRankingComponent!: SettingRankingComponent;

  public setting = hospitalSetting;
  public settingTime: any = {
    hospital_setting_end_evening: '',
    hospital_setting_start_evening: '',
    hospital_setting_end_morning: '',
    hospital_setting_start_morning: '',
  };
  public settingRank: any = {
    hospital_setting_sys_ranking_low: '',
    hospital_setting_sys_ranking_medium: '',
    hospital_setting_sys_ranking_medium_high: '',
    hospital_setting_sys_ranking_high: '',
    hospital_setting_dia_ranking_low: '',
    hospital_setting_dia_ranking_medium: '',
    hospital_setting_dia_ranking_medium_high: '',
    hospital_setting_dia_ranking_high: '',
  };
  public countComponent = 0;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hospitalSetting && this.hospitalSetting) {
      if (!this.isCreate) {
        delete this.hospitalSetting.hospital_setting.hospital_setting_id;
        Object.keys(this.settingTime).map((key: string) => {
          this.settingTime[key] = this.hospitalSetting.hospital_setting[key];
        });

        Object.keys(this.settingRank).map((key: string) => {
          this.settingRank[key] = this.hospitalSetting.hospital_setting[key];
        });
      } else {
        this.settingTime = JSON.parse(JSON.stringify(defaultSetting.default_hospital_setting_time));
        this.settingRank = JSON.parse(JSON.stringify(defaultSetting.hospital_setting_ranking));
      }
    }
  }

  /**
   *handle event when checkbox in setting function area is clicked
   * @param key: string
   */
  onSettingFunction(key: string) {
    let index = this.hospitalSetting?.hospital_setting_functions.findIndex((item: any) => {
      return item.hospital_setting_function_type === key;
    });

    if (index >= 0) {
      this.hospitalSetting.hospital_setting_functions[index].hospital_setting_function_status = this.hospitalSetting
        .hospital_setting_functions[index].hospital_setting_function_status
        ? 0
        : 1;
    }
  }

  /**
   *handle event when function usage settings is clicked
   * @param key string
   */
  onChangeSetting(key: string) {
    this.hospitalSetting.hospital_setting[key] = this.hospitalSetting.hospital_setting[key] ? 0 : 1;
    if (key === 'hospital_setting_email_thanks' || key === 'hospital_setting_monthly_report') {
      this.changeMailSetting.emit({
        value: this.hospitalSetting.hospital_setting[key],
        key: key,
      });
    }
  }

  /**
   * check checkbox alert have been active
   * @param key: string
   */
  checkSettingFunction(key: string) {
    let alert = this.hospitalSetting?.hospital_setting_functions.find((item: any) => {
      return item.hospital_setting_function_type === key;
    });
    return alert?.hospital_setting_function_status;
  }

  /**
   * reset ranking to default
   */
  resetRankingClicked() {
    this.settingRank = JSON.parse(JSON.stringify(defaultSetting.hospital_setting_ranking));
  }

  /**
   * handle event when submitSuccess event emitted
   * @param data
   */
  onSubmit() {
    return forkJoin({
      settingTime: this.settingTimeComponent.onSubmit(),
      ranking: this.settingRankingComponent.onSubmit(),
    }).pipe(
      map((e: any) => {
        if (!e.settingTime) {
          scrollIntoView('setting-time');
        } else if (!e.ranking) {
          scrollIntoView('setting-rank');
        }

        if (e.settingTime && e.ranking) {
          Object.keys(e.settingTime).map((key: string) => {
            this.hospitalSetting.hospital_setting[key] = e.settingTime[key];
          });

          Object.keys(e.ranking).map((key: string) => {
            this.hospitalSetting.hospital_setting[key] = e.ranking[key];
          });

          return this.hospitalSetting;
        }
        return null;
      })
    );
  }
}
