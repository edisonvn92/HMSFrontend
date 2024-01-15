import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseChart } from '../base-chart';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import moment from 'moment';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-alert-chart',
  templateUrl: './alert-chart.component.html',
  styleUrls: ['./alert-chart.component.scss'],
})
export class AlertChartComponent implements OnInit, OnChanges {
  @Input() startDate: string | Date = new Date();
  @Input() endDate: string | Date = new Date();
  @Input() patient: any;
  @Input() hospitalSetting: any;
  @Output() updateAlertChart: EventEmitter<any> = new EventEmitter<any>();

  showPopup = false;
  clickedAlert: any;
  clickedAlertType: string = '';
  popupPosition: any;
  targetPosition: any;
  showChart = true;
  alertChart: BaseChart | any;
  currentAlert: any;
  cellWidth: number = 0;
  period: number = 28;

  constructor(private translateService: TranslateService, public sharedService: SharedService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if the period changes reboot the whole chart
    // create chart when new data arrive
    if (changes.patient && this.alertChart && this.patient) {
      this.alertChart.data = this.patient;
      this.period = moment(this.endDate).diff(this.startDate, 'days') + 1;
      this.loadChart();
      this.alertChart.createChart();
      this.alertChart.isLoading = false;
    }
  }

  ngOnInit(): void {
    this.alertChart = new AlertChart(this.startDate, this.endDate, 'alert-chart', this.translateService);
    this.alertChart.openCommentModal = this.openCommentModal;
    this.alertChart.hospitalSetting = this.hospitalSetting;
    this.alertChart.isLoading = false;
  }

  /**
   * load chart by disposing old chart and create new chart
   */
  loadChart() {
    if (this.alertChart) {
      this.alertChart.dispose();
      this.alertChart.startDate = this.startDate;
      this.alertChart.endDate = this.endDate;
      this.alertChart.boot();
    }
  }

  /**
   * Check mouse is inside the modal
   * @param isInside boolean
   */
  changeInside(isInside: boolean = true): void {
    this.alertChart.isInside = isInside;
  }

  /**
   * function when toggle show hide button
   */
  toggleChart() {
    this.showChart = !this.showChart;
    this.showPopup = false;
  }

  /**
   * open detail popup
   * @param cursorPosition cursor position sent from chart
   */
  openCommentModal = (cursorPosition: any) => {
    this.cellWidth = cursorPosition.cellWidth;
    this.clickedAlert = Object.values(this.patient).find((log: any) => {
      if (log.alert_ldate) {
        return moment(log.alert_ldate).isSame(moment(cursorPosition.x), 'day');
      } else return false;
    });
    if (JSON.stringify(this.clickedAlert) !== JSON.stringify(this.currentAlert)) {
      this.popupPosition = cursorPosition.position;
      this.currentAlert = this.clickedAlert;
    }
    if (this.clickedAlert && cursorPosition.alertType && cursorPosition.alertType !== 'alert_times') {
      this.showPopup = true;
      this.clickedAlertType = cursorPosition.alertType;
      this.targetPosition = cursorPosition.targetPosition;
    } else {
      this.showPopup = false;
      this.alertChart.isInside = false;
    }
  };

  /**
   * function when submit button in popup is clicked
   * @param update update from popup
   */
  updateChart(update: any) {
    this.showPopup = false;
    this.updateAlertChart.emit(update);
    this.alertChart.isInside = false;
    this.alertChart.isLoading = true;
  }
}

export class AlertChart extends BaseChart {
  public openCommentModal: ((data: any) => {}) | any;
  private cursorPosition: any = { x: 0, y: 0, position: 0, alertType: '' };
  alertSetting: any[] = [];
  isInside = false;
  isLoading = false;
  max = 600;
  valueAxis: am4charts.Axis | any;
  step: number = 12;
  XValue: any = {
    alert_af: {
      text: 'af',
      function_type: 'AF',
    },
    alert_ihb: {
      text: 'IHB',
      function_type: 'IHB',
    },
    alert_low_bp: {
      text: 'minimum blood pressure',
      function_type: 'BP',
    },
    alert_high_bp: {
      text: 'maximum blood pressure',
      function_type: 'BP',
    },
    alert_weight: {
      text: 'body weight',
      function_type: 'WEIGHT',
    },
    alert_times: {
      text: 'number of alerts',
      function_type: 'times',
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

    this.alertSetting = [];
    Object.values(this.hospitalSetting?.hospital_setting_functions?.ALERT || {}).map((alert: any) => {
      if (alert?.hospital_setting_function_status) {
        this.alertSetting.push(alert?.hospital_setting_function_type);
      }
    });

    if (this.alertSetting.includes('BP')) {
      this.step = this.max / (2 * (this.alertSetting.length + 2));
    } else {
      this.step = this.max / (2 * (this.alertSetting.length + 1));
    }

    if (this.data) {
      Object.values(this.data).map((dataInDay: any) => {
        const value: any = {
          date: new Date(dataInDay.alert_ldate),
        };

        let alertTimes = 0;
        let alertIndex = 0;
        let dataIncludeAlertKey = false;
        Object.keys(this.XValue).map((key: string) => {
          if (key === 'alert_times' && alertTimes) {
            value[key] = alertTimes;
            value[`${key}_value`] = (alertIndex + 1) * this.step;
          } else if (this.alertSetting.includes(this.XValue[key].function_type)) {
            if (dataInDay[key]) {
              alertTimes++;
              dataIncludeAlertKey = true;
            }
            value[key] = dataInDay[key];
            value[`${key}_value`] = (alertIndex + 1) * this.step;
            this.XValue[key].value = (alertIndex + 1) * this.step;
            alertIndex += 2;
          }
        });

        if (value.date && dataIncludeAlertKey) {
          modifiedData.push(value);
        }
      });
    }

    return modifiedData;
  }

  /**
   * Process to create each invidual chart.
   * Process is super create chart to create xy axis => create chart => create grid
   */
  createChart(): void {
    super.createChart();
    this.createLineSeries();
    this.createCursorFullWidth();
  }

  /**
   * Set up cursor behavior for the chart
   */
  createCursorFullWidth(): void {
    super.createCursorFullWidth();
    this.contentChart.cursor.events.on('cursorpositionchanged', (ev: any) => {
      if (!this.isInside && !this.isLoading) {
        let xAxis = ev.target.chart.xAxes.getIndex(0);
        let yAxis = ev.target.chart.yAxes.getIndex(0);
        this.cursorPosition.x = xAxis.positionToDate(xAxis.toAxisPosition(ev.target.xPosition));
        this.cursorPosition.y = yAxis.positionToValue(yAxis.toAxisPosition(ev.target.yPosition));
        let clickedDate = moment(this.cursorPosition.x).set({ h: 12, m: 0 });
        this.cursorPosition.position =
          clickedDate.diff(this.dateAxis.min as Date) / moment(this.dateAxis.max).diff(this.dateAxis.min);
      }
    });
    am4core.getInteraction().body.events.on('hit', () => {
      if (!this.isInside && !this.isLoading) {
        this.cursorPosition.alertType = '';
        let hourXClicked = moment(this.cursorPosition.x).get('hour');
        if (hourXClicked >= 3 && hourXClicked <= 20) {
          Object.keys(this.XValue).forEach((key: string) => {
            // check whether clicking is inside the image
            let value = this.XValue[key].value;
            if (
              value &&
              this.cursorPosition.y >= value - 30 &&
              this.cursorPosition.y <= value + 30 &&
              hourXClicked > 6 &&
              hourXClicked < 17
            ) {
              let data = this.contentChart.data.find((log: any) => {
                return moment(log.date).isSame(moment(this.cursorPosition.x), 'day');
              });

              if (data && data[key]) {
                this.cursorPosition.targetPosition = data[`${key}_value`] / 5 - 5 + '%';

                this.cursorPosition.alertType = key;
              } else this.cursorPosition.alertType = '';
            }
          });
        }
        this.cursorPosition.cellWidth = this.cellWidth;
        this.openCommentModal(this.cursorPosition);
      }
    });
  }

  /**
   * Create Y axis for this chart
   */
  createYAxis() {
    // create alert axis
    this.valueAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.valueAxis.min = 0;
    this.valueAxis.max = this.max;
    this.valueAxis.tooltip.disabled = true;
    this.valueAxis.baseInterval = {
      count: 1,
    };

    this.valueAxis.renderer.grid.template.disabled = true;
    this.valueAxis.renderer.labels.template.disabled = true;
    this.valueAxis.renderer.labels.template.fontSize = 12;

    if (this.alertSetting && this.alertSetting.length) {
      let alertIndex = 0;
      // create value range
      Object.keys(this.XValue).forEach((key: string) => {
        if (key === 'alert_times') {
          const range = this.valueAxis.axisRanges.create();
          range.value = (alertIndex + 1) * this.step;
          range.grid.opacity = 0;
          range.label.html = `${this.translate.instant(this.XValue[key].text)}`;
          range.label.fill = this.labelColor;

          //create line range
          const lineRange = this.valueAxis.axisRanges.create();
          lineRange.value = this.step * alertIndex;
          lineRange.grid.opacity = 1;
        } else if (this.alertSetting.includes(this.XValue[key].function_type)) {
          const range = this.valueAxis.axisRanges.create();
          range.value = (alertIndex + 1) * this.step;
          range.grid.opacity = 0;
          range.label.html = `${this.translate.instant(this.XValue[key].text)}`;
          range.label.fill = this.labelColor;

          // create stroke dash array range
          if (alertIndex) {
            const strokeRange = this.valueAxis.axisRanges.create();
            strokeRange.value = alertIndex * this.step;
            strokeRange.grid.strokeDasharray = '4';
            strokeRange.grid.opacity = 1;
          }
          alertIndex += 2;
        }
      });
    }
  }

  /**
   * Create body stepCount series
   *
   */
  createLineSeries() {
    Object.keys(this.XValue).forEach((key: string) => {
      const series = this.contentChart.series.push(new am4charts.LineSeries());
      series.yAxis = this.valueAxis;
      series.dataFields.dateX = 'date';
      series.dataFields.valueY = key + '_value';
      series.strokeWidth = 0;

      const bullet = series.bullets.push(new am4charts.Bullet());
      if (key === 'alert_times') {
        let labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.text = '{alert_times}';
        labelBullet.label.fill = am4core.color('#FF7474');
      } else {
        const image = bullet.createChild(am4core.Image);
        image.width = 16;
        image.height = 16;
        image.horizontalCenter = 'middle';
        image.verticalCenter = 'middle';
        image.cursorOverStyle = am4core.MouseCursorStyle.pointer;
        image.adapter.add('href', (href: any, target: any) => {
          href = '';
          if (target.dataItem) {
            const d: any = this.contentChart.data.find((dat: any) => {
              return dat.date === target.dataItem.dateX;
            });
            if (d[key]) {
              href = d[key]['alert_diary_is_confirmed']
                ? './assets/images/ic_circle_danger_green.svg'
                : './assets/images/ic_circle_danger_red.svg';
            }
          }
          return href;
        });
      }
    });
  }
}
