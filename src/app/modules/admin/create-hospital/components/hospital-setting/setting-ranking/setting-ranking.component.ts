import { Component, Input } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-setting-ranking',
  templateUrl: './setting-ranking.component.html',
  styleUrls: ['./setting-ranking.component.scss'],
})
export class SettingRankingComponent {
  @Input() setting: any;

  public error: any = {};
  public color = {
    low: '#64B4D8',
    medium: '#F7D546',
    medium_high: '#FF8A33',
    high: '#DF2F2F',
  };

  constructor() {}

  /**
   * check input value is error
   * @returns
   */
  public get isError(): boolean {
    return Object.getOwnPropertyNames(this.error).length !== 0;
  }

  /**
   * handle event when submit button is clicked
   */
  onSubmit() {
    const regex = new RegExp('^[x0-9<>=&| ()]*$');
    this.error = {};
    Object.keys(this.setting).map((key: string) => {
      if (!this.setting[key]) {
        this.error[key] = { required: true };
      } else if (
        !regex.test(this.setting[key]) ||
        !this.checkIncludeString(this.setting[key], '&&', '&') ||
        !this.checkIncludeString(this.setting[key], '||', '|')
      ) {
        this.error.pattern = true;
      }
    });

    if (this.isError) {
      return of(null);
    }

    return of(this.setting);
  }

  /**
   * check value string is include string 1 but not include string 2
   * @param value
   * @param string1
   * @param string2
   * @returns
   */
  checkIncludeString(value: string, string1: string, string2: string) {
    let text = value.split(string1);
    let result = text.filter((item, index) => {
      return (!item && index !== 0 && index !== text.length - 1) || item.includes(string2);
    });

    return !result.length;
  }
}
