import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { fullDayOfWeek } from '@shared/helpers/data';
import { patientDairyMedication, patientDairyEvent } from '@shared/helpers/data';
import { PatientService } from '@services/doctor/patient.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { IHospitalThresholdBp } from '@models/hospitalThresholdBp';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Input() hospitalThresholdBp: IHospitalThresholdBp | any = {};
  @Input() target: any;
  @Input() isCloseLeftPanel: boolean = false;

  @Output() toggleLeftPanel: EventEmitter<any> = new EventEmitter();

  public activeMonth: string | Date = new Date();
  public fullDayOfWeek = fullDayOfWeek;
  public formatType = 'YYYY-MM-DD';
  public startDayInMonth = 0;
  public width = 39;
  public calendar!: any;
  public evaluation!: any;
  public evaluationStatus = '';
  public patientId!: string;
  public dayList: Array<number> = [];

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id') || '';
    this.activeMonth = this.formatDatetime(new Date());
    this.startDayInMonth = moment(this.activeMonth).startOf('month').day();
    this.getCalendar();
  }

  /**
   * Get calendar info about diary medication/event/memo and evaluation and blood pressure
   */
  getCalendar() {
    const startDate = this.formatDatetime(this.activeMonth).substring(0, 8) + '01';
    const bodyRequest = {
      patient_id: this.patientId,
      start_date: startDate,
    };
    this.patientService.getCalendar(bodyRequest).subscribe(
      (data) => {
        this.sharedService.showLoadingEventEmitter.emit(false);
        this.calendar = data.calendar;
        this.evaluation = data.evaluation;

        this.evaluationActiveMonthStatus();
        if (this.evaluationStatus === 'not_start') {
          this.dayList = this.range(1, this.getDaysInMonth(), 1);
          for (let i = 0; i < this.startDayInMonth; i++) {
            this.dayList.unshift(0);
          }
        } else {
          this.dayList = this.getAllDayFromSecondRow();
        }
      },
      () => {
        this.sharedService.showLoadingEventEmitter.emit(false);
      }
    );
  }

  /**
   * handle when prev button is clicked
   */
  clickPrevMonth(): void {
    this.activeMonth = moment(this.activeMonth).subtract(1, 'months').format(this.formatType);
    this.startDayInMonth = moment(this.activeMonth).startOf('month').day();
    this.getCalendar();
  }

  /**
   * handle when prev button is clicked
   */
  clickNextMonth(): void {
    this.activeMonth = moment(this.activeMonth).add(1, 'months').format(this.formatType);
    this.startDayInMonth = moment(this.activeMonth).startOf('month').day();
    this.getCalendar();
  }

  /**
   * check evaluation status
   */
  evaluationActiveMonthStatus(): void {
    if (!this.evaluation) {
      const latestActiveMonth = this.formatDatetime(this.activeMonth).substring(0, 8) + this.getDaysInMonth();
      // today >= latest active month and not have evaluation
      if (this.formatDatetime(new Date()) >= latestActiveMonth) {
        this.evaluationStatus = 'not_complete';
      } else {
        // today < latest active month and not have evaluation
        this.evaluationStatus = 'not_start';
      }
    } else {
      this.evaluationStatus = 'complete';
    }
  }

  /**
   * calculate width of review content follow start date of month
   */
  calcReviewWidth(): string {
    if (this.startDayInMonth === 5) {
      return this.width * 5 + 'px';
    }
    if (this.startDayInMonth === 6) {
      return this.width * 6 + 'px';
    }
    return this.width * 7 + 'px';
  }

  /**
   * generate day list for first row in the same line with review
   */
  calcStartDayArray(): Array<number> {
    if (this.startDayInMonth === 5) {
      return [1, 2];
    }
    if (this.startDayInMonth === 6) {
      return [1];
    }
    return [];
  }

  /**
   * generate day list from second row
   */
  getAllDayFromSecondRow(): Array<number> {
    if (this.startDayInMonth === 5) {
      return this.range(3, this.getDaysInMonth(), 1);
    }
    if (this.startDayInMonth === 6) {
      return this.range(2, this.getDaysInMonth(), 1);
    }

    const dayList = this.range(1, this.getDaysInMonth(), 1);
    for (let i = 0; i < this.startDayInMonth; i++) {
      dayList.unshift(0);
    }
    return dayList;
  }

  /**
   * get number day in month
   */
  getDaysInMonth(): number {
    return moment(this.activeMonth).daysInMonth();
  }

  /**
   * create array for range
   *
   * @param start - start number
   * @param stop - end number
   * @param step - step between 2 number
   */
  range(start: number, stop: number, step: number): Array<number> {
    return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
  }

  /**
   * format datetime follow type
   * @param datetime
   * @param type
   */
  formatDatetime(datetime: Date | string, type: string = 'YYYY-MM-DD'): string {
    if (!datetime) {
      return '';
    }
    return moment(datetime).format(type);
  }

  /**
   * check if day is today or not
   * @param day - number
   */
  isToday(day: number): boolean {
    const currentDate = this.formatDatetime(new Date())?.toString().split('-');
    const activeMonth = this.activeMonth?.toString().split('-');
    return (
      !!currentDate &&
      !!activeMonth &&
      currentDate[0] === activeMonth[0] &&
      currentDate[1] === activeMonth[1] &&
      Number(currentDate[2]) === day
    );
  }

  /**
   * get event list in a day
   *
   * @param arrayEvent - diary event array
   */
  handleDiaryEvent(arrayEvent: Array<number> = []): Array<string> {
    // sort asc event
    arrayEvent.sort((a, b) => {
      return a - b;
    });
    let eventList: Array<string> = [];
    if (arrayEvent.includes(patientDairyEvent.SLEEP)) {
      eventList.push('icon_sleep_calendar');
    }
    if (arrayEvent.includes(patientDairyEvent.MOTION)) {
      eventList.push('icon_exercise_calendar');
    }
    if (arrayEvent.includes(patientDairyEvent.VEGETABLE)) {
      eventList.push('icon_vegetable_intake_calendar');
    }
    if (arrayEvent.includes(patientDairyEvent.NO_SALT)) {
      eventList.push('icon_reduced_salt_calendar');
    }
    if (arrayEvent.includes(patientDairyEvent.NO_ALCOHOL)) {
      eventList.push('icon_saving_sake_calendar');
    }
    if (arrayEvent.includes(patientDairyEvent.NO_SMOKING)) {
      eventList.push('icon_no_smoking_calendar');
    }

    return eventList;
  }

  /**
   * get icon medicine follow diary medication in a day
   *
   * @param arrMedication - diary medication array
   */
  handleDiaryMedication(arrMedication: Array<number> = []): string {
    const prefix = 'icon_medicine';
    if (
      arrMedication.includes(patientDairyMedication.MORNING) &&
      arrMedication.includes(patientDairyMedication.NOON) &&
      arrMedication.includes(patientDairyMedication.EVENING)
    ) {
      return prefix + '111.svg';
    } else if (
      arrMedication.includes(patientDairyMedication.MORNING) &&
      arrMedication.includes(patientDairyMedication.NOON)
    ) {
      return prefix + '110.svg';
    } else if (
      arrMedication.includes(patientDairyMedication.MORNING) &&
      arrMedication.includes(patientDairyMedication.EVENING)
    ) {
      return prefix + '101.svg';
    } else if (
      arrMedication.includes(patientDairyMedication.NOON) &&
      arrMedication.includes(patientDairyMedication.EVENING)
    ) {
      return prefix + '011.svg';
    } else if (arrMedication.includes(patientDairyMedication.EVENING)) {
      return prefix + '001.svg';
    } else if (arrMedication.includes(patientDairyMedication.NOON)) {
      return prefix + '010.svg';
    } else if (arrMedication.includes(patientDairyMedication.MORNING)) {
      return prefix + '100.svg';
    }

    return prefix + '000.svg';
  }

  /**
   * get all action in 1 day include diary event, diary medication, diary memo,
   *
   * @param day - number
   */
  getActionIcon(day: number): {
    eventList: string[];
    medicine: string;
    hasMemo: boolean;
    morning: string;
    evening: string;
  } {
    let hasMemo = false;
    let medicine = 'icon_medicine000.svg';
    let eventList: Array<string> = [];
    let morning = 'icon_gray_morning.svg';
    let evening = 'icon_gray_evening.svg';
    const dayString = this.formatDatetime(this.activeMonth).substring(0, 8) + (day < 10 ? '0' + day : day);
    const data = this.calendar ? this.calendar[dayString] : null;
    if (data) {
      if (data.patient_diary_memo) {
        hasMemo = true;
      }
      medicine = this.handleDiaryMedication(data.patient_diary_medication || []);
      eventList = this.handleDiaryEvent(data.patient_diary_event || []);
      morning = this.handleSysDiaMorningEvening(data, 'morning');
      evening = this.handleSysDiaMorningEvening(data, 'evening');
    }
    return {
      medicine,
      eventList,
      hasMemo,
      morning,
      evening,
    };
  }

  /**
   * get icon action for morning
   *
   * @param dataInDay: { patient_stat_sys_evening: number; patient_stat_dia_evening: number }
   * @param type - morning | evening
   */
  handleSysDiaMorningEvening(dataInDay: any, type = 'morning'): string {
    let icon = `icon_gray_${type}.svg`;
    if (
      !this.sharedService.hospitalSetting?.hospital_setting?.hospital_setting_threshold_bp ||
      !this.target.patient_sys_goal ||
      !this.target.patient_dia_goal ||
      !dataInDay
    ) {
      return icon;
    }
    const sys = `patient_stat_sys_${type}`;
    const dia = `patient_stat_dia_${type}`;
    if (
      dataInDay[sys] >= this.target?.patient_sys_goal + this.hospitalThresholdBp?.hospital_threshold_bp_black_sys ||
      dataInDay[dia] >= this.target?.patient_dia_goal + this.hospitalThresholdBp?.hospital_threshold_bp_black_dia
    ) {
      return `icon_black_${type}.svg`;
    }
    if (
      dataInDay[sys] >= this.target?.patient_sys_goal + this.hospitalThresholdBp?.hospital_threshold_bp_dark_red_sys ||
      dataInDay[dia] >= this.target?.patient_dia_goal + this.hospitalThresholdBp?.hospital_threshold_bp_dark_red_dia
    ) {
      return `icon_dark_red_${type}.svg`;
    }
    if (dataInDay[sys] >= this.target?.patient_sys_goal || dataInDay[dia] >= this.target.patient_dia_goal) {
      return `icon_light_red_${type}.svg`;
    }
    if (
      (dataInDay[sys] && dataInDay[sys] < this.target?.patient_sys_goal) ||
      (dataInDay[dia] && dataInDay[dia] < this.target.patient_dia_goal)
    ) {
      return `icon_low_${type}.svg`;
    }
    return icon;
  }
}
