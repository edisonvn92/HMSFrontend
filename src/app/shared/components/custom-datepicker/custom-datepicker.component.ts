import { Component, EventEmitter, Injectable, Input, Output, ViewChild } from '@angular/core';
import {
  NgbDate,
  NgbDateParserFormatter,
  NgbDatepickerI18n,
  NgbDateStruct,
  NgbInputDatepicker,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { fullDayOfWeekDatePicker, monthNames } from '@shared/helpers/data';

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
  constructor(public translate: TranslateService) {
    super();
  }

  getWeekdayLabel(weekday: number): string {
    return this.translate.instant(fullDayOfWeekDatePicker[weekday - 1]);
  }
  getWeekLabel(): string {
    return '';
  }
  getMonthShortName(month: number): string {
    return this.translate.currentLang === 'ja' ? month + this.translate.instant('month') : monthNames[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }
  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}

@Component({
  selector: 'app-custom-datepicker',
  templateUrl: './custom-datepicker.component.html',
  styleUrls: ['./custom-datepicker.component.scss'],
  providers: [{ provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }],
})
export class CustomDatepickerComponent {
  @ViewChild(NgbInputDatepicker, { static: false }) ngbDatepicker!: NgbInputDatepicker;
  @Input() startDate!: Date | null;
  @Input() endDate!: Date | null;
  @Input() minDate!: Date | null;
  @Input() maxDate!: Date | null;
  @Input() date!: Date | null;
  @Input() disabled: boolean = false;
  @Input() inputClass: string = '';

  // type:
  // undefined - the date picker
  // start - date range picker width start date value
  // end- date range picker width end date value
  @Input() type!: string;
  @Input() hasIcon: boolean = false;
  @Input() format: string = 'YYYY-MM-DD';
  @Input() placeholder: string = '';
  @Output() dateChange = new EventEmitter();
  public hoveredDate: NgbDate | null = null;
  public max!: Date | null;
  public min!: Date | null;

  constructor(public formatter: NgbDateParserFormatter) {}

  /**
   * Handle event when user selected date
   *
   * @param date : the value output
   */
  onDateSelection(date: NgbDate) {
    this.ngbDatepicker.toggle();

    this.dateChange.emit(new Date(date.year, date.month - 1, date.day));
  }

  /**
   * set range year default
   */
  setDefaultRangeYear() {
    let date = new Date();
    if (this.date) date = this.date;
    if (this.startDate && this.type === 'start') date = this.startDate;
    if (this.endDate && this.type === 'end') date = this.endDate;

    let ngbDate = this.validateDate(date);
    this.max = new Date(ngbDate.year + 20, 11, 31);
    this.min = new Date(ngbDate.year - 140, 0, 1);
  }

  /**
   * Handle event when user selected date
   *
   * @param date : the value output
   */
  onOpenDatePicker() {
    setTimeout(() => {
      this.ngbDatepicker.toggle();
      if (!this.minDate && !this.maxDate) {
        this.setDefaultRangeYear();
      }
    }, 0);
  }

  /**
   *check date is hover
   *
   * @param date
   * @returns
   */
  isHovered(date: NgbDate) {
    return (
      this.startDate &&
      !this.endDate &&
      this.hoveredDate &&
      date.after(this.validateDate(this.startDate)) &&
      date.before(this.hoveredDate)
    );
  }

  /**
   * check date is Inside the range
   *
   * @param date
   * @returns
   */
  isInside(date: NgbDate) {
    if (!this.startDate || !this.endDate) {
      return false;
    }
    return (
      this.endDate && date.after(this.validateDate(this.startDate)) && date.before(this.validateDate(this.endDate))
    );
  }

  /**
   * check date is Range of date
   *
   * @param date
   * @returns
   */
  isRange(date: NgbDate) {
    return (
      date.equals(this.validateDate(this.date)) ||
      date.equals(this.validateDate(this.startDate)) ||
      (this.endDate && date.equals(this.validateDate(this.endDate))) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  /**
   * formatDate in format string
   *
   * @param date
   * @returns
   */
  formatDate(date: Date | null) {
    return date ? moment(date).format(this.format) : '';
  }

  /**
   * change type Date to NgbDate
   *
   * @param date
   * @returns
   */
  validateDate(date: Date | null): NgbDateStruct {
    var momentDate = moment(date);

    var ngbDate = {
      year: date ? momentDate.year() : 0,
      month: date ? momentDate.month() + 1 : 0,
      day: date ? momentDate.date() : 0,
    };

    return ngbDate;
  }
}
