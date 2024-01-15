import { ECGDataResult, report } from '@shared/helpers/data';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import moment from 'moment';
import { ECGRecordTrendBaseChart } from './ecg-record-trend-base-chart';

export class RecordIn12MonthsChart extends ECGRecordTrendBaseChart {
  secondaryXAxis: am4charts.Axis | any;
  endDate: Date | string = new Date();

  constructor(containerId: string, data: any, endDate: Date | string, language: string) {
    super(containerId, data, language);
    this.endDate = endDate;
    this.loadData();
    this.createChart();
  }

  /**
   * modify data for the chart
   * @returns modified data
   */
  loadData() {
    let monthList = this.createMonthList();
    let modifiedList: any[] = [];
    monthList.forEach((month: string, index: number) => {
      let modifiedData: any = {
        month: month.slice(5),
        position: index + 0.22,
        normal: 0,
        danger: 0,
        danger_for_line: 0,
        abnormal: 0,
        abnormal_for_line: 0,
        unclassified: 0,
        unclassified_for_line: 0,
        stroke_width_normal: 0,
        stroke_width_danger: 0,
        stroke_width_abnormal: 0,
        stroke_width_unclassified: 0,
      };
      let data = (this.data as any[]).find((data) => data.vital_heart_beat_month === month);
      let total = 0;
      if (data && data.vital_heart_beat_count) {
        Object.keys(data.vital_heart_beat_count).forEach((key) => {
          total += data.vital_heart_beat_count[key];
          if (key == ECGDataResult.NORMAL) {
            modifiedData.normal = data.vital_heart_beat_count[key];
            modifiedData.danger_for_line += data.vital_heart_beat_count[key];
            modifiedData.abnormal_for_line += data.vital_heart_beat_count[key];
            modifiedData.unclassified_for_line += data.vital_heart_beat_count[key];
          }
          if (key == ECGDataResult.TACHYCARDIA || key == ECGDataResult.BRADYCARDIA) {
            modifiedData.abnormal += data.vital_heart_beat_count[key];
            modifiedData.abnormal_for_line += data.vital_heart_beat_count[key];
            modifiedData.unclassified_for_line += data.vital_heart_beat_count[key];
          }
          if (key == ECGDataResult.AFIB_POSSIBLE) {
            modifiedData.danger = data.vital_heart_beat_count[key];
            modifiedData.danger_for_line += data.vital_heart_beat_count[key];
            modifiedData.abnormal_for_line += data.vital_heart_beat_count[key];
            modifiedData.unclassified_for_line += data.vital_heart_beat_count[key];
          }
          if (key == ECGDataResult.UNCLASSIFIED) {
            modifiedData.unclassified = data.vital_heart_beat_count[key];
            modifiedData.unclassified_for_line += data.vital_heart_beat_count[key];
          }
        });
      }
      if (total > this.maxValue) this.maxValue = total;
      modifiedList.push(modifiedData);
    });
    let dataArray = this.setDataForLineSeries(modifiedList);
    return dataArray;
  }

  /**
   * set data for line series
   */
  setDataForLineSeries(dataList: any[]): any[] {
    let modifiedList: any[] = [];
    dataList.forEach((data, index) => {
      let nextValue: any = {};
      if (index < dataList.length) nextValue = dataList[index + 1];
      // add data on right edge of column
      let modifiedData2: any = {
        position: index + 0.57,
        normal: data.normal,
        danger: data.danger,
        danger_for_line: data.danger_for_line,
        abnormal: data.abnormal,
        abnormal_for_line: data.abnormal_for_line,
        unclassified: data.unclassified,
        unclassified_for_line: data.unclassified_for_line,
      };
      // remove line if value = 0
      if (nextValue && (nextValue.normal === 0 || modifiedData2.normal === 0)) modifiedData2.stroke_width_normal = 0;
      else modifiedData2.stroke_width_normal = 0.5;
      if (nextValue && (nextValue.abnormal === 0 || modifiedData2.abnormal === 0))
        modifiedData2.stroke_width_abnormal = 0;
      else modifiedData2.stroke_width_abnormal = 0.5;
      if (nextValue && (nextValue.danger === 0 || modifiedData2.danger === 0)) modifiedData2.stroke_width_danger = 0;
      else modifiedData2.stroke_width_danger = 0.5;
      if (nextValue && (nextValue.unclassified === 0 || modifiedData2.unclassified === 0))
        modifiedData2.stroke_width_unclassified = 0;
      else modifiedData2.stroke_width_unclassified = 0.5;
      nextValue = modifiedData2;
      modifiedList.push(data);
      modifiedList.push(modifiedData2);
    });
    return modifiedList;
  }

  /**
   * create empty month array for chart
   * @returns month array
   */
  private createMonthList() {
    let endDate = moment(this.endDate);
    let startDate = moment(this.endDate).subtract(11, 'months');
    let date = startDate;
    let monthList: string[] = [];
    while (date <= endDate) {
      let month = date.clone().format('YYYY-MM');
      monthList.push(month);
      date = date.add(1, 'month');
    }
    return monthList;
  }

  createChart() {
    super.createChart();
    this.contentChart.padding(10, 5, 0, -10);
  }

  createSeries() {
    this.createLineSeries('normal', this.normalColor, 'stroke_width_normal');
    this.createLineSeries('abnormal_for_line', this.abnormalColor, 'stroke_width_abnormal');
    this.createLineSeries('danger_for_line', this.dangerColor, 'stroke_width_danger');
    this.createLineSeries('unclassified_for_line', this.unclassifiedColor, 'stroke_width_unclassified');
    super.createSeries();
  }

  /**
   * create date axis with label
   */
  createDateAxis() {
    super.createDateAxis();
    this.dateAxis.renderer.cellStartLocation = 0.05;
    this.dateAxis.renderer.cellEndLocation = 0.75;
    this.dateAxis.height = 22;
    this.dateAxis.dataFields.category = 'month';
    this.dateAxis.title.text = `[[${report[this.language].month}]]`;
    this.dateAxis.title.align = 'right';
    this.dateAxis.title.valign = 'top';
    this.dateAxis.title.fontSize = '10pt';
    this.dateAxis.title.dy = -15;
    this.dateAxis.dx = -5;
    this.dateAxis.title.dx = 6;
  }

  /**
   * create secondary date axis for line series
   */
  createSecondaryXAxis() {
    this.secondaryXAxis = this.contentChart.xAxes.push(new am4charts.ValueAxis());
    this.secondaryXAxis.min = 0;
    this.secondaryXAxis.max = 12;
    this.secondaryXAxis.height = 0;
    this.secondaryXAxis.renderer.grid.template.disabled = true;
    this.secondaryXAxis.renderer.labels.template.disabled = true;
    this.secondaryXAxis.renderer.baseGrid.disabled = true;
  }

  createYAxis() {
    super.createYAxis();
    this.yAxis.height = 91;
    this.yAxis.min = 0;
    this.yAxis.renderer.minGridDistance = 20;
  }

  createColumn(length: string, fillColor: string): any {
    let series = super.createColumn(length, fillColor);
    series.dataFields.categoryX = 'month';
  }

  /**
   * create line series connecting columns
   * @param category category for each line
   * @param fillColor line color
   */
  createLineSeries(category: string, fillColor: string, strokeField: string) {
    let series = this.contentChart.series.push(new am4charts.LineSeries());
    series.xAxis = this.secondaryXAxis;
    series.yAxis = this.yAxis;
    series.dataFields.valueY = category;
    series.dataFields.valueX = 'position';
    series.stroke = am4core.color(fillColor);
    series.propertyFields.strokeWidth = strokeField;
  }
}
