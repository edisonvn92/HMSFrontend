import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseChart } from '@modules/doctor/patient-detail/charts/base-chart';
import { TranslateService } from '@ngx-translate/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { SharedService } from '@shared/services/shared.service';
import { alertType } from '@shared/helpers/data';
import { getPluralNoun } from '@shared/helpers';
import moment from 'moment';

@Component({
  selector: 'app-heart-beat-chart',
  templateUrl: './heart-beat-chart.component.html',
  styleUrls: ['./heart-beat-chart.component.scss'],
})
export class HeartBeatChartComponent implements OnInit, OnChanges {
  @Input() startDate: string | Date = new Date();
  @Input() endDate: string | Date = new Date();
  @Input() hospitalSetting: any;
  @Input() patient: any;
  @Output() openHeartBeatHistory: EventEmitter<any> = new EventEmitter<any>();

  heartBeatChart: BaseChart | any;
  showChart = true;

  constructor(private translateService: TranslateService, public sharedService: SharedService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if the period changes reboot the whole chart
    // create chart when new data arrive
    if (changes.patient && this.heartBeatChart && this.patient) {
      this.heartBeatChart.data = this.patient;
      this.loadChart();
    }
  }

  ngOnInit(): void {
    this.heartBeatChart = new HeartBeatChart(this.startDate, this.endDate, 'heart-beat-chart', this.translateService);
    this.heartBeatChart.hospitalSetting = this.hospitalSetting;
  }

  /**
   * load chart by disposing old chart and create new chart
   */
  loadChart() {
    if (this.heartBeatChart) {
      this.heartBeatChart.dispose();
      this.heartBeatChart.startDate = this.startDate;
      this.heartBeatChart.endDate = this.endDate;
      this.heartBeatChart.boot();
      this.heartBeatChart.createChart();
    }
  }

  /**
   * function when toggle show hide button
   */
  toggleChart() {
    this.showChart = !this.showChart;
    if (this.showChart) {
      this.heartBeatChart.contentChart.show();
    } else {
      this.heartBeatChart.contentChart.hide();
    }
  }
}

export class HeartBeatChart extends BaseChart {
  heartBeatAxis: am4charts.Axis | any;
  secondaryXAxis: am4charts.Axis | any;

  createChartContainer(containerId: string) {
    super.createChartContainer(containerId);
  }

  /**
   * handle tooltip
   *
   * @param dataInDay
   */
  getTooltipHTML(dataInDay: any): string {
    const spaceFollowLang = this.translate.currentLang === 'ja' ? '' : ' ';
    let htmlString = '';
    if (dataInDay.heart_beat && dataInDay.heart_beat.patient_stat_heart_beat_morning) {
      htmlString = `${htmlString}
      <div>${this.translate.instant('morning')} ${dataInDay.heart_beat.patient_stat_heart_beat_morning} bpm</div>`;
    }
    if (dataInDay.heart_beat && dataInDay.heart_beat.patient_stat_heart_beat_evening) {
      htmlString = `${htmlString}
        <div>${this.translate.instant('night')} ${dataInDay.heart_beat.patient_stat_heart_beat_evening} bpm</div>`;
    }
    const alertAf1 = dataInDay.alert_af ? dataInDay.alert_af[alertType.TYPE1] : null;
    if (alertAf1) {
      htmlString = `${htmlString}
        <div class="text-lowercase">${alertAf1.alert_af_times || '-'}
        ${spaceFollowLang}${this.translate.instant('time detection')}/
        ${alertAf1.alert_af_days || '-'}
        ${spaceFollowLang}${this.getPluralNoun('day', 'days', alertAf1.alert_af_days, 'Day')}</div>`;
    }
    const alertAf2 = dataInDay.alert_af ? dataInDay.alert_af[alertType.TYPE2] : null;
    if (alertAf2) {
      htmlString = `${htmlString}
        <div class="text-lowercase">${alertAf2.alert_af_times || '-'}
        ${spaceFollowLang}${this.translate.instant('continuous detection')}</div>`;
    }
    if (htmlString) {
      htmlString = `<div style="min-width: 120px;">${htmlString}</div>`;
    }

    return htmlString;
  }

  /**
   * organize data to prepare for chart
   * @returns organized data
   */
  loadData(): any[] {
    let modifiedData: any[] = [];
    const dataArray = Object.keys(this.data) as any[];
    const setting_function_status =
      this.hospitalSetting?.hospital_setting_functions?.ALERT?.AF?.hospital_setting_function_status;
    dataArray.forEach((key: any) => {
      const dataInDay = this.data[key];
      if (setting_function_status || (!setting_function_status && dataInDay.heart_beat)) {
        if (!setting_function_status) {
          dataInDay['alert_af'] = null;
        }

        const tooltipHTML = this.getTooltipHTML(dataInDay);

        modifiedData.push({
          date: moment(`${key} 09:00:00`).toDate(),
          patient_stat_heart_beat: dataInDay.heart_beat ? dataInDay.heart_beat.patient_stat_heart_beat_morning : null,
          alert_af: dataInDay.alert_af,
          color: dataInDay.alert_af ? am4core.color('#FF7474') : am4core.color('#306F95'),
          alert_value: 20,
          tooltip: tooltipHTML,
          tooltip_af: !!dataInDay.heart_beat ? '' : tooltipHTML,
          key,
        });
        modifiedData.push({
          date: moment(`${key} 14:00:00`).toDate(),
          patient_stat_heart_beat: dataInDay.heart_beat ? dataInDay.heart_beat.patient_stat_heart_beat_evening : null,
          color: dataInDay.alert_af ? am4core.color('#FF7474') : am4core.color('#003153'),
          alert_value: 20,
          tooltip: tooltipHTML,
          tooltip_af: !!dataInDay.heart_beat ? '' : tooltipHTML,
          key,
        });
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
    this.dateAxis.renderer.line.strokeOpacity = 1;
    this.dateAxis.renderer.line.stroke = am4core.color('#D8D8D8');
    super.createCursorFullWidth();
    this.createSecondaryXAxis();
    this.createHeartBeatSeries();
    this.createAFSeries();
  }

  /**
   * Create secondary X axis for blood pressure chart and pulse chart, base on hour instead of day
   */
  createSecondaryXAxis() {
    this.contentChart.bottomAxesContainer.layout = 'vertical';
    this.secondaryXAxis = this.contentChart.xAxes.push(new am4charts.DateAxis());
    this.secondaryXAxis.min = moment(this.startDate + ' 00:00:00')
      .toDate()
      .getTime();
    this.secondaryXAxis.max = moment(this.endDate + ' 23:59:59')
      .toDate()
      .getTime();
    this.secondaryXAxis.renderer.grid.template.location = 0;
    this.secondaryXAxis.baseInterval = {
      timeUnit: 'hour',
      count: 1,
    };
    this.secondaryXAxis.gridIntervals.setAll([{ timeUnit: 'day', count: 1 }]);
    this.secondaryXAxis.renderer.cellStartLocation = 0;
    this.secondaryXAxis.renderer.cellEndLocation = 1;
    this.secondaryXAxis.renderer.grid.template.disabled = true;
    this.secondaryXAxis.renderer.labels.template.disabled = true;
    this.secondaryXAxis.paddingLeft = 8;
    this.secondaryXAxis.paddingRight = -8;
    this.secondaryXAxis.cursorTooltipEnabled = false;
  }

  /**
   * Create Y axis for this chart
   */
  createYAxis() {
    // create alert axis
    this.heartBeatAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.heartBeatAxis.min = this.hospitalSetting?.hospital_setting_functions?.ALERT?.AF
      ?.hospital_setting_function_status
      ? 0
      : 40;
    this.heartBeatAxis.max = 130;
    this.heartBeatAxis.strictMinMax = true;
    this.heartBeatAxis.tooltip.disabled = true;
    this.heartBeatAxis.renderer.minWidth = 35;
    this.heartBeatAxis.baseInterval = {
      count: 1,
    };

    this.heartBeatAxis.renderer.grid.template.disabled = true;
    this.heartBeatAxis.renderer.labels.template.disabled = true;
    this.heartBeatAxis.renderer.labels.template.fontSize = 12;

    // create value range
    this.createHorizontalGrid(this.heartBeatAxis, 40, { color: '#D8D8D8' });
    this.createHorizontalGrid(this.heartBeatAxis, 60, { color: '#FF7474', labelFill: '#FF7474' });
    this.createHorizontalGrid(this.heartBeatAxis, 80, { color: '#E5E5E5', strokeDasharray: 4 });
    this.createHorizontalGrid(this.heartBeatAxis, 100, { color: '#FF7474', labelFill: '#FF7474' });
    this.createHorizontalGrid(this.heartBeatAxis, 120, { color: '#D8D8D8' });

    // create AF range
    if (this.hospitalSetting?.hospital_setting_functions?.ALERT?.AF?.hospital_setting_function_status) {
      const range = this.heartBeatAxis.axisRanges.create();
      range.value = 20;
      range.grid.opacity = 0;
      range.label.html = `${this.translate.instant('atrial fibrillation')}`;
      range.label.fill = this.labelColor;
    }
  }

  /**
   * create heart beat series
   */
  createHeartBeatSeries() {
    const heartBeatSeries = this.contentChart.series.push(new am4charts.LineSeries());
    heartBeatSeries.yAxis = this.heartBeatAxis;
    heartBeatSeries.xAxis = this.secondaryXAxis;
    heartBeatSeries.dataFields.dateX = 'date';
    heartBeatSeries.dataFields.valueY = 'patient_stat_heart_beat';
    heartBeatSeries.stroke = am4core.color('#B2B2B2');

    // add circle bullet for each data
    const bullet = heartBeatSeries.bullets.push(new am4charts.Bullet());
    const bulletCircle = bullet.createChild(am4core.Circle);
    bulletCircle.radius = 4;
    bulletCircle.propertyFields.fill = 'color';
    bulletCircle.stroke = am4core.color('white');
    bullet.tooltipHTML = '{tooltip}';

    if (heartBeatSeries.tooltip) {
      this.setTooltipProperty(heartBeatSeries.tooltip);
    }
  }

  /**
   * Create body weight series
   *
   */
  createAFSeries() {
    const series = this.contentChart.series.push(new am4charts.LineSeries());
    series.yAxis = this.heartBeatAxis;
    series.dataFields.dateX = 'date';
    series.dataFields.valueY = 'alert_value';
    series.strokeWidth = 0;
    if (!this.hospitalSetting?.hospital_setting_functions?.ALERT?.AF?.hospital_setting_function_status) {
      series.height = 0;
    } else {
      this.setTooltipProperty(series.tooltip);

      // add circle bullet for each data
      const bullet = series.bullets.push(new am4charts.Bullet());

      const image = bullet.createChild(am4core.Image);
      image.width = 25;
      image.height = 25;
      image.horizontalCenter = 'middle';
      image.verticalCenter = 'middle';
      image.adapter.add('href', (href: any, target: any) => {
        href = '';
        if (target.dataItem) {
          const d: any = this.contentChart.data.find((dat: any) => {
            return dat.date === target.dataItem.dateX;
          });
          if (d.alert_af) {
            href = './assets/images/icon_heart_2.svg';
            bullet.tooltipHTML = '{tooltip_af}';
          }
        }
        return href;
      });
    }
  }

  // change tooltip property comparing to base function
  setTooltipProperty(tooltip: am4core.Tooltip): void {
    super.setTooltipProperty(tooltip);
    tooltip.label.minWidth = 120;
    tooltip.label.textAlign = 'middle';
    tooltip.pointerOrientation = 'horizontal';
  }

  /**
   * get text noun in en language
   * @param singularNoun
   * @param pluralNoun
   * @param value
   * @param textJa
   * @returns
   */
  getPluralNoun(singularNoun: string, pluralNoun: string, value: number, textJa: string): string {
    if (this.translate.currentLang === 'ja') return this.translate.instant(textJa);
    return getPluralNoun(this.translate.instant(singularNoun), this.translate.instant(pluralNoun), value);
  }
}
