import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { environment } from '@env/environment';
import { defaultPatientLanguage } from '@shared/helpers/data';
import { getDayOfWeek } from '@shared/helpers';

export class ECGRecordTrendBaseChart {
  contentChart: am4charts.XYChart | any;
  public containerId: string = '';
  data: any;
  language: string = defaultPatientLanguage;
  maxValue: number = 4;
  dateAxis: am4charts.Axis | any;
  yAxis: am4charts.Axis | any;
  public normalColor = '#264c73';
  public dangerColor = '#913b69';
  public abnormalColor = '#d34c83';
  public unclassifiedColor = '#a4a5a4';

  /**
   * base constructor for ecg xy chart
   * @param containerId container id
   * @param data data input
   * @param language language of user
   */
  constructor(containerId: string, data: any, language: string) {
    this.containerId = containerId;
    this.data = data;
    this.language = language;
    am4core.addLicense(environment.amchart_license_code);
  }

  loadData() {}

  /**
   * base to create xy chart in ecg report
   */
  createChart() {
    this.contentChart = am4core.create(this.containerId, am4charts.XYChart);
    this.contentChart.height = am4core.percent(100);
    this.contentChart.data = this.loadData();
    this.contentChart.padding(10, 0, 0, -10);
    this.createDateAxis();
    this.createSecondaryXAxis();
    this.createYAxis();
    this.createSeries();
    this.createLabel();
  }

  /**
   * base to create X axis for this chart
   */
  createDateAxis() {
    this.dateAxis = this.contentChart.xAxes.push(new am4charts.CategoryAxis());
    this.dateAxis.renderer.cellStartLocation = 0.15;
    this.dateAxis.renderer.cellEndLocation = 0.85;
    this.dateAxis.renderer.grid.template.disabled = true;
    this.dateAxis.renderer.minGridDistance = 15;
    let label = this.dateAxis.renderer.labels.template;
    label.dy = -3;
    label.fontSize = '10pt';
  }

  /**
   * base to create Y axis for this chart
   */
  createYAxis() {
    this.yAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.yAxis.width = 35;
    this.yAxis.min = 0;
    this.yAxis.max = this.maxValue;
    this.yAxis.calculateTotals = true;
    this.yAxis.renderer.minGridDistance = 10;
    this.yAxis.renderer.labels.template.fontSize = '11pt';
    if (this.yAxis.tooltip) {
      this.yAxis.tooltip.disabled = true;
    }
  }

  createSeries() {
    this.createColumn('normal', this.normalColor);
    this.createColumn('danger', this.dangerColor);
    this.createColumn('abnormal', this.abnormalColor);
    this.createColumn('unclassified', this.unclassifiedColor);
  }

  /**
   * base to create a separate column for the chart
   */
  createColumn(length: string, fillColor: string): any {
    let series = this.contentChart.series.push(new am4charts.ColumnSeries());
    series.xAxis = this.dateAxis;
    series.yAxis = this.yAxis;
    series.dataFields.valueY = length;
    series.stacked = true;
    series.strokeWidth = 1;
    series.fill = am4core.color(fillColor);
    series.stroke = am4core.color('white');
    series.strokeWidth = 0.1;
    series.columns.template.width = am4core.percent(50);
    series.columns.template.adapter.add('strokeWidth', function (width: any, target: any) {
      if (target.dataItem && target.dataItem.valueY === 0) {
        return 0;
      } else {
        return width;
      }
    });
    return series;
  }

  /**
   * Get day of week follow day index
   * @param dayOfWeek
   */
  getDayOfWeek(dayOfWeek: number): string {
    return getDayOfWeek(dayOfWeek);
  }
  createLabel() {}
  createSecondaryXAxis() {}
}
