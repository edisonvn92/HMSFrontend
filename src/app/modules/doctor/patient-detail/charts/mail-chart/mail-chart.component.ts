import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseChart } from '../base-chart';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { SharedService } from '@shared/services/shared.service';
import { componentCode, patientDairyEvent, reportStatus, reportType } from '@shared/helpers/data';
import moment from 'moment';
import { downloadPdf, scrollToTop, replaceAllCommentCharacter } from '@shared/helpers';
import { PatientService } from '@data/services/doctor/patient.service';

@Component({
  selector: 'app-mail-chart',
  templateUrl: './mail-chart.component.html',
  styleUrls: ['./mail-chart.component.scss'],
})
export class MailChartComponent implements OnInit, OnChanges {
  @Input() startDate: string | Date = new Date();
  @Input() endDate: string | Date = new Date();
  @Input() patient: any;
  @Input() hospitalOrder: any;
  @Input() patientID!: string;
  @Input() patientCode: any;

  showChart = true;
  mailChart: BaseChart | any;

  constructor(
    private translateService: TranslateService,
    public patientService: PatientService,
    public sharedService: SharedService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if the period changes reboot the whole chart
    // create chart when new data arrive
    if (changes.patient && this.mailChart && this.patient) {
      this.mailChart.position = this.checkChartPosition();
      this.mailChart.data = this.patient;
      this.loadChart();
      this.mailChart.createChart();
      this.mailChart.downloadReport = this.downloadReport;
      this.mailChart.patientService = this.patientService;
      this.mailChart.sharedService = this.sharedService;
    }
  }

  ngOnInit(): void {
    this.mailChart = new MailChart(this.startDate, this.endDate, 'mail-chart', this.translateService);
  }

  /**
   * check position chart in screen
   * @returns chart position
   */
  checkChartPosition(): string {
    let minOrder: number | null = null;
    let maxOrder: number | null = null;
    let minCount = 0;
    Object.keys(this.hospitalOrder).forEach((key: string) => {
      if (key.includes('RP')) {
        if (minOrder === null || this.hospitalOrder[key] < minOrder) {
          minOrder = this.hospitalOrder[key];
          minCount = 1;
        } else if (this.hospitalOrder[key] === minOrder) minCount += 1;
        if (maxOrder === null || this.hospitalOrder[key] > maxOrder) maxOrder = this.hospitalOrder[key];
      }
    });
    if (this.hospitalOrder[componentCode.OTHER_GRAPH] === maxOrder) return 'end';
    if (this.hospitalOrder[componentCode.OTHER_GRAPH] === minOrder && minCount === 1) return 'start';
    return 'between';
  }

  /**
   * load chart by disposing old chart and create new chart
   */
  loadChart() {
    if (this.mailChart) {
      this.mailChart.dispose();
      this.mailChart.startDate = this.startDate;
      this.mailChart.endDate = this.endDate;
      this.mailChart.boot();
    }
  }

  /**
   * download report pdf
   * @param data download report
   */
  downloadReport = (data: any) => {
    const dateTimeUTC = moment.utc(data.patient_report_utc_time).format('YYYYMMDDHHmm');
    const dateTimeLocal = moment(data.patient_report_utc_time).format('YYYYMMDDHHmm');
    let fileName = data.patient_report_name.replace(this.patientID, this.patientCode);

    if (data.patient_report_type == reportType.MANUAL) {
      fileName = fileName.replace(dateTimeUTC, dateTimeLocal);
    }

    this.patientService.downloadReportBP({ patient_report_id: data.patient_report_id }).subscribe(
      (base64Data: any) => {
        downloadPdf(fileName, base64Data);
        this.mailChart.currentReport = '';
        this.sharedService.showLoadingEventEmitter.emit(false);
      },
      () => {
        this.sharedService.showLoadingEventEmitter.emit(false);
      }
    );
  };

  /**
   * function when toggle show hide button
   */
  toggleChart() {
    this.showChart = !this.showChart;
  }
}

export class MailChart extends BaseChart {
  downloadReport: ((data: any) => {}) | any;
  patientService!: PatientService;
  sharedService!: SharedService;
  valueAxis: am4charts.Axis | any;
  isLeftPointer: boolean = false;
  position: string = 'start';
  currentReport: any;
  currentBullet: any;
  lifeImprovements = [
    {
      icon: './assets/images/icon_smoking.svg',
      text: 'no smoking',
      value: patientDairyEvent.NO_SMOKING,
    },
    {
      icon: './assets/images/icon_smoking_1.svg',
      text: 'smoking',
      value: patientDairyEvent.SMOKING,
    },
    {
      icon: './assets/images/icon_saving_sake.svg',
      text: 'sobriety',
      value: patientDairyEvent.NO_ALCOHOL,
      class: 'mt-2px',
    },
    {
      icon: './assets/images/icon_alcohol.svg',
      text: 'alcohol',
      value: patientDairyEvent.ALCOHOL,
      class: 'mt-2px',
    },
    {
      icon: './assets/images/icon_reduced_salt.svg',
      text: 'reduced salt',
      value: patientDairyEvent.NO_SALT,
    },
    {
      icon: './assets/images/icon_salt.svg',
      text: 'salt',
      value: patientDairyEvent.SALT,
    },
    {
      icon: './assets/images/icon_vegetable_intake.svg',
      text: 'vegetable intake',
      value: patientDairyEvent.VEGETABLE,
      class: 'mt-2px',
    },
    {
      icon: './assets/images/icon_lack_of_vegetables.svg',
      text: 'lack of vegetables',
      value: patientDairyEvent.NO_VEGETABLE,
      class: 'mt-2px',
    },
    {
      icon: './assets/images/icon_sleep.svg',
      text: 'sleep',
      value: patientDairyEvent.SLEEP,
    },
    {
      icon: './assets/images/icon_lack_of_sleep.svg',
      text: 'lack of sleep',
      value: patientDairyEvent.NO_SLEEP,
    },
    {
      icon: './assets/images/icon_exercise.svg',
      text: 'motion',
      value: patientDairyEvent.MOTION,
    },
    {
      icon: './assets/images/icon_lack_of_exercise.svg',
      text: 'lack of exercise',
      value: patientDairyEvent.NO_MOTION,
    },
  ];

  XValue: any = {
    memo: {
      value: 3,
      text: 'memo',
      icon: './assets/images/icon_memo.svg',
      icon_width: 20,
      icon_height: 16,
    },
    mail: {
      value: 2,
      text: 'mail',
      icon: './assets/images/icon_mail.svg',
      icon_width: 15,
      icon_height: 12,
    },
    report: {
      value: 1,
      text: 'report',
      icon: './assets/images/icon_report.svg',
      icon_err: './assets/images/icon_report_red.svg',
      icon_width: 26,
      icon_height: 20,
    },
  };

  createChartContainer(containerId: string) {
    super.createChartContainer(containerId);
  }

  /**
   * organize data to prepare for chart
   * @returns organized data
   */
  loadData(): any[] {
    let modifiedData: any[] = [];

    Object.values(this.data).map((dataInDay: any) => {
      const value: any = {
        date: new Date(dataInDay.patient_other_ldate),
        memo: this.hasMemo(dataInDay),
        mail: dataInDay.patient_email,
        report: dataInDay.patient_report,
        memo_html: this.getTooltipHTML(dataInDay, 'memo'),
        report_html: this.getTooltipHTML(dataInDay, 'report'),
        mail_html: this.getTooltipHTML(dataInDay, 'mail'),
        report_failure:
          dataInDay.patient_report_items &&
          dataInDay.patient_report_items.find(
            (element: any) =>
              element.patient_report_type === reportType.AUTOMATIC &&
              element.patient_report_status !== reportStatus.SUCCESS
          ),
        memo_value: 3,
        mail_value: 2,
        report_value: 1,
      };

      if (value.date) {
        modifiedData.push(value);
      }
    });
    return modifiedData;
  }

  /**
   * check data has memo
   * @param data
   * @returns boolean
   */
  hasMemo(data: any) {
    let flag = false;
    if (data.patient_memo_items && data.patient_memo_items[0].patient_diary_event) {
      data.patient_memo_items[0].patient_diary_event.forEach((item: any) => {
        if (item <= 15 && item >= 4) flag = true;
      });
    }
    if (
      data.patient_memo_items &&
      data.patient_memo_items[0].patient_diary_memo &&
      data.patient_memo_items[0].patient_diary_memo.trim() !== ''
    ) {
      flag = true;
    }
    return flag;
  }

  /**
   * Process to create each invidual chart.
   * Process is super create chart to create xy axis => create chart => create grid
   */
  createChart(): void {
    super.createChart();
    this.createLineSeries();
    super.createCursorFullWidth();
  }

  /**
   * Create Y axis for this chart
   */
  createYAxis() {
    // create alert axis
    this.valueAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.valueAxis.min = 0;
    this.valueAxis.max = 4;
    this.valueAxis.tooltip.disabled = true;
    this.valueAxis.renderer.minWidth = 35;
    this.valueAxis.baseInterval = {
      count: 1,
    };

    this.valueAxis.renderer.grid.template.disabled = true;
    this.valueAxis.renderer.labels.template.disabled = true;
    this.valueAxis.renderer.labels.template.fontSize = 12;

    // create value range
    Object.keys(this.XValue).forEach((key: string) => {
      const range = this.valueAxis.axisRanges.create();
      range.value = this.XValue[key].value;
      range.grid.opacity = 0;
      range.label.html = `${this.translate.instant(this.XValue[key].text)}`;
      range.label.fill = this.labelColor;
    });
  }

  /**
   * Create body line series
   *
   */
  createLineSeries() {
    const middleDate = (new Date(this.startDate).getTime() + new Date(this.endDate).getTime()) / 2;
    let isInside = true;
    Object.keys(this.XValue).forEach((key: string) => {
      const series = this.contentChart.series.push(new am4charts.LineSeries());
      series.yAxis = this.valueAxis;
      series.dataFields.dateX = 'date';
      series.dataFields.valueY = key + '_value';
      series.strokeWidth = 0;

      const bullet = series.bullets.push(new am4charts.Bullet());

      bullet.alwaysShowTooltip = true;
      bullet.events.on('hit', (ev: any) => {
        if (this.currentBullet) {
          scrollToTop(this.currentBullet.tooltip.uid);
          this.currentBullet.tooltip.hide();
        }

        this.currentBullet = ev.target;
        this.isLeftPointer = this.currentBullet.dataItem.dateX.getTime() < middleDate ? true : false;
        this.currentBullet.tooltipHTML = `<div id="${this.currentBullet.tooltip.uid}"
                                            class="amchart-tooltip-content"  style="${
                                              this.position === 'start' || key !== 'memo'
                                                ? key === 'memo'
                                                  ? 'max-height:140px'
                                                  : 'max-height:145px'
                                                : 'max-height:235px'
                                            };padding-right:4px;padding-left:4px;max-width:250px">{${key}_html}</div>`;
        this.currentBullet.invalidate();
        this.currentBullet.showTooltip();

        this.currentBullet.tooltip.events.on('track', () => {
          isInside = false;

          this.currentBullet.tooltip.events.disableType('track');
          this.currentBullet.tooltip.events.enableType('over');
        });
        this.currentBullet.tooltip.events.on('over', () => {
          isInside = true;
          this.currentBullet.tooltip.events.disableType('over');
          this.currentBullet.tooltip.events.enableType('track');
        });

        if (key === 'report') {
          this.currentBullet.tooltip.events.on('hit', (ev: any) => {
            if (
              ev.event.srcElement.classList.contains('report-link') &&
              this.currentReport !== ev.event.srcElement.children[0].value
            ) {
              this.currentReport = ev.event.srcElement.children[0].value;
              this.downloadReport(JSON.parse(ev.event.srcElement.children[0].value.split(`'`).join('"')));
            }
          });
        }

        if (this.currentBullet.tooltip) {
          this.setTooltipProperty(this.currentBullet.tooltip);
          if (key === 'memo' || key === 'report') {
            this.currentBullet.tooltip.background.fill = am4core.color('#ffffff');
            this.currentBullet.tooltip.background.stroke = am4core.color('#d9d9d9');
            let shadow = this.currentBullet.tooltip.background.filters.push(new am4core.DropShadowFilter());
            shadow.dx = 0;
            shadow.dy = 0;
            shadow.blur = 10;
            shadow.color = am4core.color('#00000030');
          }
        }
      });

      am4core.getInteraction().body.events.on('hit', () => {
        if (this.currentBullet && !isInside) {
          scrollToTop(this.currentBullet.tooltip.uid);
          this.currentReport = '';
          this.currentBullet.tooltip.hide();
        }
      });

      if (this.XValue[key].icon) {
        const image = bullet.createChild(am4core.Image);
        image.width = this.XValue[key].icon_width;
        image.height = this.XValue[key].icon_height;
        image.horizontalCenter = 'middle';
        image.verticalCenter = 'middle';
        image.cursorOverStyle = am4core.MouseCursorStyle.pointer;
        image.adapter.add('href', (href: any, target: any) => {
          href = '';
          if (target.dataItem) {
            const d: any = this.contentChart.data.find((dat: any) => {
              return dat.date === target.dataItem.dateX;
            });
            if (d[key]) href = d[`${key}_failure`] ? this.XValue[key].icon_err : this.XValue[key].icon;
          }
          return href;
        });
      }
    });
  }

  // change tooltip property comparing to base function
  setTooltipProperty(tooltip: am4core.Tooltip): void {
    super.setTooltipProperty(tooltip);
    tooltip.pointerOrientation = this.isLeftPointer ? 'left' : 'right';
    tooltip.dx = this.isLeftPointer ? 9 : -9;
    tooltip.label.minWidth = 10;
    tooltip.label.textAlign = 'middle';
    tooltip.background.fillOpacity = 1;
    tooltip.label.interactionsEnabled = true;
    tooltip.keepTargetHover = true;
  }

  //get tooltip html
  getTooltipHTML(data: any, xLabel: string): string {
    let htmlString: any = '';
    if (xLabel === 'report' && data.patient_report_items && data.patient_report_items.length) {
      data.patient_report_items.forEach((item: any) => {
        const time = moment(item.patient_report_utc_time).format('HH:mm');
        const text =
          item.patient_report_type === reportType.MANUAL
            ? 'report output'
            : item.patient_report_status === reportStatus.SUCCESS
            ? 'report automatic delivery'
            : 'report automatic delivery failure';
        htmlString = `${htmlString}
                      <div class="d-flex text-black-300 text-small">
                        ●
                        <span class="mr-2 ml-2 report-link">
                          <input value="${JSON.stringify(item).split('"').join(`'`)}" type="hidden"/>
                          ${this.translate.instant(text)}
                        </span>
                        ${item.patient_report_type === reportType.MANUAL ? time : ''}
                      </div>`;
      });
    } else if (xLabel === 'mail' && data.patient_email_items && data.patient_email_items.length) {
      data.patient_email_items.forEach((item: any) => {
        const time = moment(item.patient_email_utc_time).format('HH:mm');
        htmlString = `${htmlString}<div class="text-white text-small">● <span class="ml-2">${time}</span></div>`;
      });
    } else if (xLabel === 'memo') {
      this.lifeImprovements.forEach((item) => {
        if (
          data.patient_memo_items &&
          data.patient_memo_items[0].patient_diary_event &&
          data.patient_memo_items[0].patient_diary_event.includes(item.value)
        ) {
          htmlString = `${htmlString}<div class="d-flex align-items-center mt-1">
          <img src="${item.icon}" alt="" style="width:22px; height:22px" class="status-icon" />
          <div class="d-flex ml-2 align-items-center">
            <div class="text-small text-no-break text-center text-blue-600 ${item.class || ''}">
            ${this.translate.instant(item.text)}
            </div>
          </div>
      </div>`;
        }
      });

      if (
        data.patient_memo_items &&
        data.patient_memo_items[0].patient_diary_memo &&
        data.patient_memo_items[0].patient_diary_memo.trim() !== ''
      ) {
        if (htmlString) {
          htmlString = `${htmlString}<div class="line mt-2"></div>`;
        }
        htmlString = `${htmlString}
                    <div class="text-normal break-work text-black-300 mt-2 mb-3" style="white-space:pre-wrap">${replaceAllCommentCharacter(
                      data.patient_memo_items[0].patient_diary_memo
                    )}</div>`;
      }
    }

    return htmlString;
  }
}
