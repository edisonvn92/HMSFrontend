import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { environment } from '@env/environment';
import { fixNumber, floorNumber, getWeightChartYRange } from '@shared/helpers';
import { ValueAxisDataItem } from '@amcharts/amcharts4/charts';

export class WeightByMonthChart {
  lineColor = am4core.color('#5c658a');
  // public translate: TranslateService;
  public container: am4core.Container | any;
  public containerId: string = '';
  public contentChart: am4charts.XYChart | any;
  public data: any;

  public average: any;
  //variable to calculate min max for axis
  labelColor = am4core.color('#7F7F7F');
  chartFontSize = '7pt';
  yAxisData = {
    min: 0,
    max: 0,
    gridArray: [] as number[],
  };

  public xAxis: am4charts.Axis | any;
  public yAxis: am4charts.Axis | any;

  /**
   * constructor for all charts in patient details view
   * @param containerId
   * @param data
   */
  constructor(containerId: string, data: any, average: any) {
    this.containerId = containerId;
    am4core.addLicense(environment.amchart_license_code);
    am4core.options.autoSetClassName = true;
    this.data = Array.from(data);
    this.average = average;
    this.createContainer();
    this.createChart();
  }

  /**
   * create X axis
   */
  createXAxis() {
    this.xAxis = this.contentChart.xAxes.push(new am4charts.CategoryAxis());
    this.xAxis.renderer.labels.template.disabled = true;
    this.xAxis.renderer.grid.template.disabled = true;
    this.xAxis.dataFields.category = 'monthYear';
  }

  /**
   * Create Y axis for this chart
   */
  createYAxis() {
    this.yAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    let dataArray: any = [];
    Array.from(this.data).forEach((data: any) => {
      if (data.user_stat_weight) dataArray.push(data.user_stat_weight);
    });
    let maxWeight = 80;
    let minWeight = 0;
    let getMinMaxYAxis = {
      min: minWeight,
      step: 20,
    };

    if (dataArray.length > 0) {
      maxWeight = floorNumber(Math.max(...dataArray), 4) + 4;
      minWeight = floorNumber(Math.min(...dataArray), 4);
      getMinMaxYAxis = getWeightChartYRange(minWeight, maxWeight);
    }

    this.yAxis.min = getMinMaxYAxis.min;
    this.yAxis.max = getMinMaxYAxis.min + getMinMaxYAxis.step * 4 + 4;
    this.yAxis.strictMinMax = true;
    this.yAxis.calculateTotals = true;
    if (this.yAxis.tooltip) {
      this.yAxis.tooltip.disabled = true;
    }
    this.yAxis.height = 260;
    this.yAxis.renderer.minGridDistance = 30;
    this.yAxis.renderer.labels.template.fill = this.labelColor;
    this.yAxis.renderer.labels.template.fontSize = this.chartFontSize;
    this.yAxis.renderer.labels.template.disabled = true;
    this.yAxis.renderer.grid.template.disabled = true;

    Array.from(Array(5).keys()).forEach((number) => {
      this.createHorizontalGrid(this.yAxis, getMinMaxYAxis.min + getMinMaxYAxis.step * number);
    });
  }

  /**
   * Create customized label/grid for Y axis
   * @param yAxis Y axis of the chart
   * @param value the required customized value
   */
  public createHorizontalGrid(yAxis: am4charts.ValueAxis, value: number): ValueAxisDataItem {
    const range = yAxis.axisRanges.create();
    range.value = value;
    let labelText = fixNumber(value, 1);
    range.label.text = `${labelText}`;
    return range;
  }

  /**
   * Process to create each invidual chart.
   * Process is createContentChart => load data => create Date Axis => create Y axis => create series
   */
  createChart(): void {
    this.contentChart = this.container.createChild(am4charts.XYChart);
    this.contentChart.position = 'absolute';
    this.contentChart.x = 64;
    this.contentChart.data = this.loadData();
    this.createXAxis();
    this.createYAxis();
    this.createSeries();
    this.createLabel();
  }

  /**
   * organize data to prepare for chart
   * @returns organized data
   */
  loadData(): any[] {
    let modifiedData: any[] = Array.from(this.data);
    modifiedData.map((data) => {
      if (!data['user_stat_weight']) {
        delete data['user_stat_weight'];
      }
    });
    modifiedData.push({
      monthYear: 'average',
      average: this.average['user_stat_weight'],
    });

    return modifiedData;
  }

  /**
   * take numberFix digit after comma
   *
   * @param value - value need handle
   * @param numberFix -
   */
  public fixNumber(value: number, numberFix: number = 1): string {
    return fixNumber(value, numberFix);
  }

  createContainer(): void {
    this.container = am4core.create(this.containerId, am4core.Container);
    this.container.width = am4core.percent(96);
    this.container.height = 260;
  }

  /**
   * Create line series
   */
  createSeries() {
    const lineSeries = this.contentChart.series.push(new am4charts.LineSeries());
    lineSeries.yAxis = this.yAxis;
    lineSeries.xAxis = this.xAxis;
    lineSeries.dataFields.categoryX = 'monthYear';
    lineSeries.dataFields.valueY = 'user_stat_weight';
    lineSeries.stroke = this.lineColor;

    // add a dot for average value
    const lineSeries2 = this.contentChart.series.push(new am4charts.LineSeries());
    lineSeries2.yAxis = this.yAxis;
    lineSeries2.xAxis = this.xAxis;
    lineSeries2.dataFields.categoryX = 'monthYear';
    lineSeries2.dataFields.valueY = 'average';
    lineSeries2.stroke = am4core.color('#B2B2B2');

    const bullet = lineSeries.bullets.push(new am4charts.Bullet());
    const bulletCircle = bullet.createChild(am4core.Circle);
    bulletCircle.radius = 4;
    bulletCircle.fill = am4core.color('white');
    bulletCircle.stroke = this.lineColor;
    bulletCircle.strokeWidth = 2;

    const bullet2 = lineSeries2.bullets.push(new am4charts.Bullet());
    const bulletCircle2 = bullet2.createChild(am4core.Circle);
    bulletCircle2.radius = 4;
    bulletCircle2.fill = am4core.color('white');
    bulletCircle2.stroke = this.lineColor;
    bulletCircle2.strokeWidth = 2;
  }

  /**
   * create kg label for chart
   */
  createLabel() {
    const axisTitle = this.container.createChild(am4core.Label);
    axisTitle.text = '[[kg]]';
    axisTitle.align = 'center';
    axisTitle.isMeasured = false;
    axisTitle.x = 88;
    axisTitle.y = 4;
    axisTitle.fontSize = this.chartFontSize;
    axisTitle.fill = this.labelColor;
  }
}
