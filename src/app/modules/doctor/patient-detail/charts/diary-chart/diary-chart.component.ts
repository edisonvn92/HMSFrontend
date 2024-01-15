import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseChart } from '../base-chart';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { patientDairyEvent } from '@shared/helpers/data';
import { scrollToTop } from '@shared/helpers';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-diary-chart',
  templateUrl: './diary-chart.component.html',
  styleUrls: ['./diary-chart.component.scss'],
})
export class DiaryChartComponent implements OnInit, OnChanges {
  @Input() startDate: string | Date = new Date();
  @Input() endDate: string | Date = new Date();
  @Input() patient: any;

  showChart = true;
  diaryChart: DiaryChart | any;

  constructor(private translateService: TranslateService, public sharedService: SharedService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if the period changes reboot the whole chart
    // create chart when new data arrive
    if (changes.patient && this.diaryChart && this.patient) {
      this.diaryChart.data = this.patient;
      this.loadChart();
    }
  }

  ngOnInit(): void {
    this.diaryChart = new DiaryChart(this.startDate, this.endDate, 'diary-chart', this.translateService);
  }

  /**
   * load chart by disposing old chart and create new chart
   */
  loadChart() {
    if (this.diaryChart) {
      this.diaryChart.dispose();
      this.diaryChart.startDate = this.startDate;
      this.diaryChart.endDate = this.endDate;
      this.diaryChart.boot();
      this.diaryChart.createChart();
    }
  }

  /**
   * function when toggle show hide button
   */
  toggleChart() {
    this.showChart = !this.showChart;
    if (this.showChart) {
      this.diaryChart.contentChart.show();
    } else {
      this.diaryChart.contentChart.hide();
    }
  }
}

export class DiaryChart extends BaseChart {
  valueAxis: am4charts.Axis | any;
  step: number = 140;
  isLeftPointer: boolean = false;
  position: string = 'start';
  currentBullet: any;
  iconValue: any = {
    sleep: {
      value: this.step * 6.5,
      value_check: patientDairyEvent.SLEEP,
      text: 'sleep',
      icon_url: './assets/images/icon_sleep.svg',
    },
    motion: {
      value: this.step * 5.5,
      value_check: patientDairyEvent.MOTION,
      text: 'motion',
      icon_url: './assets/images/icon_exercise.svg',
    },
    vegetable: {
      value: this.step * 4.5,
      value_check: patientDairyEvent.VEGETABLE,
      text: 'vegetable',
      icon_url: './assets/images/icon_vegetable_intake.svg',
    },
    salt: {
      value: this.step * 3.5,
      value_check: patientDairyEvent.NO_SALT,
      text: 'reduced salt',
      icon_url: './assets/images/icon_reduced_salt.svg',
    },
    alcohol: {
      value: this.step * 2.5,
      value_check: patientDairyEvent.NO_ALCOHOL,
      text: 'sobriety',
      icon_url: './assets/images/icon_saving_sake.svg',
    },
    smoking: {
      value: this.step * 1.5,
      value_check: patientDairyEvent.NO_SMOKING,
      text: 'no smoking',
      icon_url: './assets/images/icon_smoking.svg',
    },
    memo: {
      value: this.step / 2,
      text: 'memo',
      icon_url: './assets/images/icon_memo.svg',
    },
  };
  maxValue = 100;

  createChartContainer(containerId: string) {
    super.createChartContainer(containerId);
  }

  /**
   * handle tooltip
   *
   * @param dataInDay
   */
  getTooltipHTML(dataInDay: any): string {
    let htmlString = '';
    if (dataInDay.patient_diary_memo) {
      htmlString = `${htmlString}${dataInDay.patient_diary_memo}`;
    }
    return htmlString;
  }

  /**
   * organize data to prepare for chart
   * @returns organized data
   */
  loadData(): any[] {
    let modifiedData: any[] = [];

    Object.values(this.data).map((dataInDay: any) => {
      let value: any = {
        date: new Date(dataInDay.patient_diary_ldate),
        tooltip: this.getTooltipHTML(dataInDay),
        patient_diary_event: dataInDay.patient_diary_event || [],
        patient_diary_memo: dataInDay.patient_diary_memo,
      };
      Object.keys(this.iconValue).forEach((key: string) => {
        value[key] = this.iconValue[key].value;
      });
      if (value.date) {
        modifiedData.push(value);
      }
    });
    return modifiedData;
  }

  /**
   * Process to create each individual chart.
   * Process is super create chart to create xy axis => create chart => create grid
   */
  createChart(): void {
    super.createChart();
    super.createCursorFullWidth();
    this.createLineSeries();
  }

  /**
   * create icon chart for each type of data in diary
   */
  createLineSeries() {
    let isInside = true;
    const middleDate = (new Date(this.startDate).getTime() + new Date(this.endDate).getTime()) / 2;
    Object.keys(this.iconValue).forEach((key: string) => {
      const imageSeries = this.contentChart.series.push(new am4charts.LineSeries());
      imageSeries.yAxis = this.valueAxis;
      imageSeries.dataFields.dateX = 'date';
      imageSeries.dataFields.valueY = key;
      imageSeries.strokeWidth = 0;

      const bullet = imageSeries.bullets.push(new am4charts.Bullet());
      let image = bullet.createChild(am4core.Image);
      image.height = key === 'memo' ? 15 : 19;
      image.horizontalCenter = 'middle';
      image.verticalCenter = 'middle';
      image.adapter.add('href', (href: any, target: any) => {
        href = '';
        if (target.dataItem) {
          const d: any = this.contentChart.data.find((dat: any) => {
            return dat.date === target.dataItem.dateX;
          });
          if (
            d &&
            ((key !== 'memo' && d.patient_diary_event.includes(this.iconValue[key]['value_check'])) ||
              (key === 'memo' && d.patient_diary_memo))
          )
            href = this.iconValue[key].icon_url;
        }
        return href;
      });

      if (key === 'memo') {
        image.cursorOverStyle = am4core.MouseCursorStyle.pointer;
        bullet.alwaysShowTooltip = true;
        bullet.events.on('hit', (ev: any) => {
          if (this.currentBullet) {
            scrollToTop(this.currentBullet.tooltip.uid);
            this.currentBullet.tooltip.hide();
          }

          this.currentBullet = ev.target;
          this.isLeftPointer = this.currentBullet.dataItem.dateX.getTime() < middleDate ? true : false;
          this.currentBullet.tooltipHTML = `<div id="${this.currentBullet.tooltip.uid}"
                                              class="amchart-tooltip-content diary-chart-tooltip">{tooltip}</div>`;
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

          if (this.currentBullet.tooltip) {
            this.setTooltipProperty(this.currentBullet.tooltip);
          }
        });

        am4core.getInteraction().body.events.on('hit', () => {
          if (this.currentBullet && !isInside) {
            scrollToTop(this.currentBullet.tooltip.uid);
            this.currentBullet.tooltip.hide();
          }
        });
      }
    });
  }

  /**
   * Create Y axis for this chart
   */
  createYAxis() {
    // create diary axis
    this.valueAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.valueAxis.renderer.labels.template.fill = this.labelColor;
    this.valueAxis.min = 0;
    this.valueAxis.max = 1000;
    this.valueAxis.tooltip.disabled = true;
    this.valueAxis.renderer.minWidth = 35;
    this.valueAxis.renderer.labels.template.disabled = true;
    this.valueAxis.renderer.grid.template.disabled = true;
    this.valueAxis.renderer.labels.template.fontSize = 12;

    // create value range
    Object.keys(this.iconValue).forEach((key: string) => {
      const range = this.valueAxis.axisRanges.create();
      range.value = this.iconValue[key].value;
      range.grid.opacity = 0;
      range.label.html = `${this.translate.instant(this.iconValue[key].text)}`;
      range.label.fill = this.labelColor;
    });
  }

  // change tooltip property comparing to base function
  setTooltipProperty(tooltip: am4core.Tooltip): void {
    super.setTooltipProperty(tooltip);
    tooltip.pointerOrientation = this.isLeftPointer ? 'left' : 'right';
    tooltip.dx = this.isLeftPointer ? 9 : -9;
    tooltip.label.minWidth = 100;
    tooltip.label.textAlign = 'middle';
    tooltip.label.interactionsEnabled = true;
    tooltip.keepTargetHover = true;
  }
}
