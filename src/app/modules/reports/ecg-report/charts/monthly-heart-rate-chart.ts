import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { environment } from '@env/environment';
import { defaultPatientLanguage, ECGDataResult } from '@shared/helpers/data';
import moment from 'moment';

export class MonthlyHeartRateChart {
  contentChart: am4charts.XYChart | any;
  public containerId: string = '';
  data: any;
  language: string = defaultPatientLanguage;
  startDate: string | Date = new Date();
  endDate: string | Date = new Date();
  maxValue: number = 4;
  dateAxis: am4charts.Axis | any;
  yAxis: am4charts.Axis | any;

  constructor(containerId: string, data: any, endDate: Date, language: string) {
    this.containerId = containerId;
    this.startDate = moment(endDate).startOf('month').toDate();
    this.endDate = moment(endDate).endOf('month').toDate();
    this.data = data;
    this.language = language;
    am4core.addLicense(environment.amchart_license_code);
    this.loadData();
    this.createChart();
  }

  /**
   * modify data for the chart
   * @returns modified data
   */
  loadData() {
    let modifiedList: any[] = [];
    this.data.forEach((data: any) => {
      if (data.vital_heart_beat_value > this.maxValue) this.maxValue = data.vital_heart_beat_value;
      let modifiedData: any = {};
      modifiedData.date = moment(data.vital_heart_beat_ldatetime).toDate();
      switch (data.vital_heart_beat_analysis) {
        case ECGDataResult.NORMAL:
          modifiedData.heartrate_normal = data.vital_heart_beat_value;
          break;
        case ECGDataResult.TACHYCARDIA:
          modifiedData.heartrate_up = data.vital_heart_beat_value;
          break;
        case ECGDataResult.BRADYCARDIA:
          modifiedData.heartrate_down = data.vital_heart_beat_value;
          break;
        case ECGDataResult.AFIB_POSSIBLE:
          modifiedData.heartrate_afib = data.vital_heart_beat_value;
          break;
        case ECGDataResult.UNCLASSIFIED:
          modifiedData.heartrate_unclassified = data.vital_heart_beat_value;
          break;
      }
      modifiedList.push(modifiedData);
    });
    return modifiedList;
  }

  /**
   * create xy chart
   */
  createChart() {
    this.contentChart = am4core.create(this.containerId, am4charts.XYChart);
    this.contentChart.data = this.loadData();
    this.contentChart.padding(14, 0, 0, -10);
    this.createDateAxis();
    this.createYAxis();
    this.createSeries();
  }

  /**
   * create x axis for this chart
   */
  createDateAxis() {
    this.dateAxis = this.contentChart.xAxes.push(new am4charts.DateAxis());
    this.dateAxis.min = new Date(this.startDate).getTime();
    this.dateAxis.max = new Date(this.endDate).getTime();
    this.dateAxis.dateFormats.setKey('day', 'd');
    this.dateAxis.height = 29;
    this.dateAxis.periodChangeDateFormats.setKey('day', 'd');
    this.dateAxis.renderer.grid.template.location = 0;
    this.dateAxis.baseInterval = {
      timeUnit: 'day',
      count: 1,
    };
    this.dateAxis.gridIntervals.setAll([{ timeUnit: 'day', count: 1 }]);
    this.dateAxis.renderer.cellStartLocation = 0.2;
    this.dateAxis.renderer.cellEndLocation = 0.8;
    this.dateAxis.renderer.grid.template.disabled = true;
    this.dateAxis.renderer.labels.template.fontSize = '11pt';
    this.dateAxis.renderer.labels.template.fill = am4core.color('#000000D9');
    this.dateAxis.cursorTooltipEnabled = false;
    this.createWeekRange();
  }

  /**
   * Create the week range grid for the chart
   */
  createWeekRange(): void {
    if (this.dateAxis) {
      this.dateAxis.events.on('datavalidated', (ev: any) => {
        const axis = ev.target;
        const start = axis.positionToDate(0);
        const end = axis.positionToDate(1);
        // create week range
        const current = new Date(start);
        while (current.getTime() < end.getTime() + 7 * 24 * 60 * 60 * 1000) {
          // find Monday and Sunday
          const weekStart = this.getMonday(current);
          let weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          if (weekEnd > new Date()) {
            weekEnd = new Date();
          }
          // Create a range
          const weekRange = axis.axisRanges.create();
          weekRange.date = weekStart;
          weekRange.endDate = weekEnd;
          weekRange.grid.strokeOpacity = 1;
          weekRange.grid.stroke = am4core.color('#a4a4a4');
          current.setDate(current.getDate() + 6);
        }
      });
    }
  }

  /**
   * Return first day of the week by a date chosen
   * @param date current Date
   * @returns first day of the week
   */
  getMonday(date: Date): Date {
    const lastday = date.getDate() - (date.getDay() || 7) + 1;
    const lastdate = new Date(date);
    lastdate.setDate(lastday);
    return lastdate;
  }

  /**
   * create y axis
   */
  createYAxis() {
    this.yAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.yAxis.min = 0;
    this.yAxis.max = this.maxValue + 5;
    this.yAxis.width = 45;
    this.yAxis.renderer.minGridDistance = 30;
    this.yAxis.calculateTotals = true;
    this.yAxis.renderer.labels.template.fontSize = '11pt';
    if (this.yAxis.tooltip) {
      this.yAxis.tooltip.disabled = true;
    }
  }

  /**
   * draw chart series
   */
  createSeries() {
    this.createScatterSeries('heartrate_normal');
    this.createScatterSeries('heartrate_afib');
    this.createScatterSeries('heartrate_up');
    this.createScatterSeries('heartrate_down');
    this.createScatterSeries('heartrate_unclassified');
  }

  /**
   * create scatter series for each type of status
   * @param dataField datafield for each status
   */
  createScatterSeries(dataField: string) {
    let lineSeries = this.contentChart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.valueY = dataField;
    lineSeries.dataFields.dateX = 'date';
    lineSeries.strokeOpacity = 0;

    var bullet = lineSeries.bullets.push(new am4charts.Bullet());
    if (dataField.includes('normal')) this.createNormalBullet(bullet);
    else if (dataField.includes('afib')) this.createAfibBullet(bullet);
    else if (dataField.includes('up')) this.createAbnormalUpBullet(bullet);
    else if (dataField.includes('down')) this.createAbnormalDownBullet(bullet);
    else this.createUnclassifiedBullet(bullet);
  }

  /**
   * create bullet for afib status
   * @param bullet bullet in amchart
   */
  createAfibBullet(bullet: any) {
    let arrow = bullet.createChild(am4core.Triangle);
    arrow.horizontalCenter = 'middle';
    arrow.verticalCenter = 'middle';
    arrow.stroke = am4core.color('white');
    arrow.strokeWidth = 0.5;
    arrow.fill = am4core.color('#923b69');
    arrow.direction = 'top';
    arrow.width = 15;
    arrow.height = 15;
  }

  /**
   * create bullet for abnormal up status
   * @param bullet bullet in amchart
   */
  createAbnormalUpBullet(bullet: any) {
    let arrow = bullet.createChild(am4core.Triangle);
    arrow.horizontalCenter = 'middle';
    arrow.verticalCenter = 'middle';
    arrow.stroke = am4core.color('white');
    arrow.strokeWidth = 0.5;
    arrow.fill = am4core.color('#d34c83');
    arrow.direction = 'top';
    arrow.width = 15;
    arrow.height = 15;
  }

  /**
   * create bullet for abnormal down status
   * @param bullet bullet in amchart
   */
  createAbnormalDownBullet(bullet: any) {
    let arrow = bullet.createChild(am4core.Triangle);
    arrow.horizontalCenter = 'middle';
    arrow.verticalCenter = 'middle';
    arrow.stroke = am4core.color('white');
    arrow.strokeWidth = 0.5;
    arrow.fill = am4core.color('#d34c83');
    arrow.direction = 'bottom';
    arrow.width = 15;
    arrow.height = 15;
  }

  /**
   * create bullet for normal status
   * @param bullet bullet in amchart
   */
  createNormalBullet(bullet: any) {
    let circle = bullet.createChild(am4core.Circle);
    circle.stroke = am4core.color('white');
    circle.strokeWidth = 0.5;
    circle.fill = am4core.color('#264c73');
    circle.direction = 'top';
    circle.radius = 8;
  }

  /**
   * create bullet for unclassified status
   * @param bullet bullet in amchart
   */
  createUnclassifiedBullet(bullet: any) {
    let arrow = bullet.createChild(am4core.Rectangle);
    arrow.horizontalCenter = 'middle';
    arrow.verticalCenter = 'middle';
    arrow.stroke = am4core.color('white');
    arrow.strokeWidth = 0.5;
    arrow.fill = am4core.color('#a4a5a4');
    arrow.direction = 'top';
    arrow.width = 15;
    arrow.height = 15;
  }
}
