import * as moment from 'moment';
import { bloodPressureLevel, fullDayOfWeek } from '@shared/helpers/data';
import hospitalDefaultSetting from '@data/json/hospitalSetting.json';
import { IMail } from '@data/models/mail';
import { environment } from '@env/environment';

/**
 * format datetime follow type
 * @param datetime
 * @param type
 * @param hasTimeZone
 */
export function formatDatetime(datetime: Date | string, type: string = 'YYYY-MM-DD', hasTimeZone = false): string {
  if (!datetime) {
    return '';
  }
  return hasTimeZone ? moment(datetime).utc().format(type) : moment(datetime).format(type);
}

/**
 * check if day is today or not
 * @param date - string
 */
export function isToday(date: string) {
  return date ? formatDatetime(date) === formatDatetime(new Date()) : false;
}

/**
 * take numberFix digit after comma
 * @param value - value need handle
 * @param numberFix -
 */
export function fixNumber(value: number, numberFix: number = 1): string {
  let power10 = Math.pow(10, numberFix);
  return value || value === 0 ? (Math.round(value * power10) / power10).toFixed(numberFix) : '';
}

/**
 * get weekday from datetime
 *
 * @param datetime - string
 * @param isNotLocalDate
 */
export function getWeekday(datetime: string, isNotLocalDate?: boolean): string {
  if (!datetime) return '';
  return isNotLocalDate ? fullDayOfWeek[moment(datetime).utc().weekday()] : fullDayOfWeek[moment(datetime).weekday()];
}

//get FirstName, MiddleName, LastName from fullName
export function handleName(fullName: string) {
  return [
    fullName
      .split(/[\s,]+/u)
      .slice(0, 1)
      .join(' '),
    fullName
      .split(/[\s,]+/u)
      .slice(1, -1)
      .join(' '),
    fullName.split(/[\s,]+/u).length === 1
      ? ''
      : fullName
          .split(/[\s,]+/u)
          .slice(-1)
          .join(''),
  ];
}

//get fullName from FirstName, MiddleName, LastName
export function joinName(
  firstName: string | undefined | null,
  middleName: string | undefined | null,
  lastName: string | undefined | null
) {
  return [firstName, middleName, lastName].join(' ').trim();
}

/**
 * Get level blood pressure follow sys and dia
 *
 * @param sysBloodPressure - number type
 * @param diaBloodPressure - number type
 * @param hospitalSetting
 */
export function getRiskLevel(sysBloodPressure: number, diaBloodPressure: number, hospitalSetting?: any): string {
  let bloodPressureLevelValue: any = bloodPressureLevel;
  let level = '-';
  (Object.values(bloodPressureLevelValue) as Array<string>).forEach((value: string) => {
    if (
      getSysBloodPressureFollowLevel(sysBloodPressure, hospitalSetting) === value ||
      getDiaBloodPressureFollowLevel(diaBloodPressure, hospitalSetting) === value
    )
      level = value;
  });
  return level;
}

/**
 * Get level blood pressure follow sys
 *
 * @param sysBloodPressure - number type
 * @param hospitalSetting
 */
export function getSysBloodPressureFollowLevel(sysBloodPressure: number, hospitalSetting?: any): string {
  return getBloodPressureFollowLevel(sysBloodPressure, 'sys', hospitalSetting);
}

/**
 * Get level blood pressure follow dia
 *
 * @param diaBloodPressure - number type
 * @param hospitalSetting
 */
export function getDiaBloodPressureFollowLevel(diaBloodPressure: number, hospitalSetting?: any): string {
  return getBloodPressureFollowLevel(diaBloodPressure, 'dia', hospitalSetting);
}

export function getBloodPressureFollowLevel(
  bloodPressure: number,
  getType: string = 'sys',
  hospitalSetting?: any
): string {
  let defaultSetting: any = hospitalDefaultSetting.hospital_setting_ranking;
  let level = '-';
  let findValue = false;
  Object.keys(defaultSetting).forEach((key: string) => {
    if (key.includes(getType)) {
      let value = hospitalSetting && hospitalSetting[key] ? hospitalSetting[key] : defaultSetting[key];
      value = value.replace(/[x]/gi, 'bloodPressure');
      if (!findValue && eval(value)) {
        findValue = true;
        level = getBloodPressureLevelFollowKey(key);
      }
    }
  });
  return level;
}

export function getBloodPressureLevelFollowKey(key: string): string {
  if (key.includes('ranking_high')) return bloodPressureLevel.high;
  if (key.includes('ranking_medium_high')) return bloodPressureLevel.mediumHigh;
  if (key.includes('ranking_medium')) return bloodPressureLevel.medium;
  if (key.includes('ranking_low')) return bloodPressureLevel.low;
  return '-';
}

/**
 * get background color follow level
 *
 * @param level - include L | M | MH | H
 */
export function getBackgroundColorFollowLevel(level: string): string {
  if (level === bloodPressureLevel.high) return 'bg-pink-100 text-white';
  if (level === bloodPressureLevel.mediumHigh) return 'bg-orange-100';
  if (level === bloodPressureLevel.medium) return 'bg-yellow-100';
  if (level === bloodPressureLevel.low) return 'bg-green-100';

  return '';
}

export function scrollToTop(idElement: string): void {
  let el = document.getElementById(idElement);
  if (el) {
    el.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}

export function focusIn(idElement: string): void {
  setTimeout(function () {
    let el = document.getElementById(idElement);
    if (el) {
      el.focus();
    }
  }, 0);
}

export function showDate(field: string, format: string = 'YYYY/MM/DD'): string {
  return field ? (isToday(field) ? 'patient detail.today' : formatDatetime(field, format)) : '';
}

export function getRiskScore(riskScore?: string | Number): string | Number {
  if (riskScore == 0) {
    return '0.0';
  }
  if (!riskScore) {
    return '-';
  }

  if (Number.isInteger(riskScore)) {
    return riskScore + '.0';
  }

  return riskScore;
}

export function getLevelNYHA(nyha: number): string {
  if (nyha === 1.8) return 'IV';
  if ([2.0, 2.5].includes(nyha)) {
    return 'III';
  }
  if ([3.5, 4].includes(nyha)) {
    return 'II M';
  }
  if ([4.3, 5].includes(nyha)) {
    return 'II S';
  }
  if (nyha >= 6.0) {
    return 'I';
  }
  return '-';
}

/**
 * convert 24h to 12h
 * @param time :string
 * @returns time am pm
 */
export function convertTime(time: string): string {
  let hour = parseInt(time[0] + time[1]);
  let suffix = 'am';
  if (hour >= 12) {
    suffix = 'pm';
    hour = hour - 12;
  }
  let hourString = hour >= 10 ? hour : '0' + hour;
  let timeString = hourString + time.slice(2, 5) + ' ' + suffix;
  if (timeString === '00:00 pm') return '12:00 am';
  return timeString;
}

export function handleSortAge(sortType: string): string {
  switch (sortType) {
    case 'asc':
      return 'desc';
    case 'desc':
      return 'asc';
    default:
      return '';
  }
}

export function getDiffDate(startDate: Date | string, endDate: Date | string, type: any = 'days'): number | string {
  if (!startDate || !endDate) return 0;
  let start = moment(startDate, 'YYYY-MM-DD').startOf(type);
  let end = moment(endDate, 'YYYY-MM-DD').startOf(type);
  return end.diff(start, type);
}

export function getPluralNoun(singularNoun: string, pluralNoun: string, value: number = 1): string {
  if (value === 1) return singularNoun;
  return pluralNoun;
}

export function getLinkMail(mail: IMail): string {
  const cc = mail.cc?.length ? `cc=${mail.cc?.join(', ')}&` : '';
  const bcc = mail.bcc?.length ? `bcc=${mail.bcc?.join(', ')}&` : '';
  const subject = !!mail.subject ? `subject=${encodeURIComponent(mail.subject)}&` : '';
  const body = !!mail.body ? `body=${encodeURIComponent(mail.body)}` : '';

  return `mailto:${mail.mailto ? encodeURIComponent(mail.mailto) : ''}?${cc}${bcc}${subject}${body}`;
}

export function range(start: number, stop: number, step: number): Array<number> {
  return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
}

export function calculateAverageFromData(dataArray: any[], field: string) {
  let sum = 0;
  let count = 0;
  dataArray.forEach((data) => {
    if (data[field]) {
      sum += data[field];
      count++;
    }
  });

  return count > 0 ? Number(fixNumber(sum / count, field.includes('weight') ? 1 : 0)) : undefined;
}

export function getReportBPIconTarget(
  bpValue: string | number,
  bpGoal: number,
  blackThreshold: number,
  redThreshhold: number
): { icon: string; color: string } {
  const target = [
    { icon: 'assets/images/icon_target_achieved.svg', color: '#008AD6' },
    { icon: 'assets/images/icon_over_target.svg', color: '#DB4A86' },
    { icon: 'assets/images/icon_over_target_2.svg', color: '#9B245A' },
    { icon: 'assets/images/icon_over_target_3.svg', color: '#4F2437' },
  ];
  const value = Number(bpValue);
  if (isNaN(value) || bpValue === null || bpValue === undefined) {
    return { icon: '', color: '' };
  }
  if (value >= bpGoal + blackThreshold) {
    return target[3];
  } else if (value >= bpGoal + redThreshhold) {
    return target[2];
  } else if (value >= bpGoal) {
    return target[1];
  } else return target[0];
}

type BPAxisData = {
  min: number;
  max: number;
  distance: number;
  gridArray: number[];
};

/**
 * calculate min max for the blood pressure axis
 * @param maxSys: max sys value
 * @param minValue: min overall value
 */
export function calculateBPGraphMinMax(maxSys: number, minValue: number): BPAxisData {
  let yAxisData: BPAxisData = {
    min: 0,
    max: 0,
    distance: 0,
    gridArray: [],
  };
  let formula1 = (maxSys - minValue) / 9 / 5;
  yAxisData.distance = Math.ceil(formula1) * 5;
  yAxisData.min = Math.floor(minValue / 10) * 10;
  yAxisData.max = yAxisData.min + yAxisData.distance * 10;
  yAxisData.gridArray = [...Array(10).keys()].map((i) => yAxisData.min + yAxisData.distance * i);
  return yAxisData;
}

/**
 * second formula for calculate min max for the blood pressure axis
 * @param maxSys: max sys value
 * @param minValue: min overall value
 */
export function calculateBPGraphMinMaxSecondFormula(maxSys: number, minValue: number): any {
  let yAxisData: any = {
    min: 0,
    max: 0,
    distance: 0,
    gridArray: [],
  };
  let formula1 = (maxSys - minValue) / 9 / 5;
  yAxisData.distance = Math.ceil(formula1) * 5 + 5;
  yAxisData.min = Math.floor(minValue / 10) * 10;
  yAxisData.max = yAxisData.min + yAxisData.distance * 10;
  yAxisData.gridArray = [...Array(10).keys()].map((i) => yAxisData.min + yAxisData.distance * i);
  return yAxisData;
}

/**
 * down load pdf file from base64 data
 * @param fileName file name
 * @param base64Data data
 */
export function downloadPdf(fileName: string, base64Data: any): void {
  let bufferArray = base64ToArrayBuffer(base64Data);
  let blobStore = new Blob([bufferArray], { type: 'application/pdf' });
  let data = window.URL.createObjectURL(blobStore);

  let link = document.createElement('a');
  document.body.appendChild(link);
  link.href = data;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(data);
  link.remove();
}

/**
 * download zip file from base64 data
 * @param fileName file name
 * @param base64Data data
 */
export function downloadZip(fileName: string, base64Data: any): void {
  let bufferArray = base64ToArrayBuffer(base64Data);
  let blobStore = new Blob([bufferArray], { type: 'application/zip' });
  let data = window.URL.createObjectURL(blobStore);
  let link = document.createElement('a');
  document.body.appendChild(link);
  link.href = data;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(data);
  link.remove();
}

/**
 * change text data to Array buffer
 * @param data data in base64 text
 * @returns array buffer
 */
export function base64ToArrayBuffer(data: string) {
  var bString = window.atob(data);
  var bLength = bString.length;
  var bytes = new Uint8Array(bLength);
  for (var i = 0; i < bLength; i++) {
    var ascii = bString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes;
}

/**
 * floor number
 * @param number:  The number should be rounded down.
 * @param multiples: The multiple you want to round to
 * @returns
 */
export function floorNumber(number: number, multiples: number): number {
  let numberRounding = Math.floor(number);
  return numberRounding - (numberRounding % multiples);
}

/**
 * get min y axis value follow min, max weight
 * @param minWeight - min weight in all data of chart
 * @param maxWeight - max weight in all data of chart
 */
export function getWeightChartYRange(minWeight: number, maxWeight: number): { min: number; step: number } {
  const min = minWeight - 8 < 0 ? 0 : minWeight - 8;
  return { min: min, step: (maxWeight - min) / 4 };
}
/**
 * Get day of week follow day index
 * @param dayOfWeek
 */
export function getDayOfWeek(dayOfWeek: number): string {
  switch (dayOfWeek) {
    case 1:
      return 'sunday';
    case 2:
      return 'monday';
    case 3:
      return 'tuesday';
    case 4:
      return 'wednesday';
    case 5:
      return 'thursday';
    case 6:
      return 'friday';
    case 7:
      return 'saturday';
    default:
      return '';
  }
}

/**
 * Count the number of alert types
 * @param hospitalSettingAlert
 */
export function getCountAlertType(hospitalSettingAlert: any): number {
  let count = 0;
  if (hospitalSettingAlert && Object.keys(hospitalSettingAlert).length > 0) {
    Object.keys(hospitalSettingAlert).forEach((alertFunc) => {
      if (hospitalSettingAlert[alertFunc]?.hospital_setting_function_status) {
        count++;
      }
    });
  }

  return count;
}

export function getYearDiff(
  startDate: Date | string,
  endDate: Date | string,
  defaultReturn: any = '-'
): number | string {
  if (!startDate || !endDate) return defaultReturn;
  if (environment.service_env === 'SHINDEN') {
    let start = moment(startDate, 'YYYY-MM-DD');
    let end = moment(endDate, 'YYYY-MM-DD');
    return end.diff(start, 'years');
  }
  let start = moment(startDate).year();
  let end = moment(endDate).year();
  return end - start;
}

export function getDayFromB2BData(dateString: string | null): Date | undefined {
  if (dateString) {
    const day = Number(dateString.substring(6, 8));
    const month = Number(dateString.substring(4, 6));
    const year = Number(dateString.substring(0, 4));
    if (day && month && year) return new Date(year, month - 1, day);
  }
  return undefined;
}

export function replaceAllCommentCharacter(str: string) {
  return str ? str.replace(/</g, '&lt;').replace(/{/g, '&lcub;') : '';
}

/**
 * check whether blood pressure data have valid attributes
 * @param data data input
 * @returns true or false
 */
export function checkBloodPressureDataNotNull(data: any): boolean {
  let checkNotNull = false;
  if (data.user_stat_body_motion || data.user_stat_ihb || data.user_stat_tight_fit === 0) {
    checkNotNull = true;
  }
  Object.keys(data).forEach((key: string) => {
    if (
      ![
        'patient_stat_ldate',
        'vital_office_utc_time',
        'user_stat_body_motion',
        'user_stat_ihb',
        'user_stat_tight_fit',
        'medical_register_utc_time',
      ].includes(key) &&
      data[key] !== null &&
      data[key] !== undefined
    ) {
      checkNotNull = true;
    }
  });
  return checkNotNull;
}

/**
 * scroll view to id
 * @param idElement
 */
export function scrollIntoView(idElement: string): void {
  setTimeout(() => {
    let el = document.getElementById(idElement);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}
