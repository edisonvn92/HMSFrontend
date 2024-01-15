import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { defaultMinMaxBP, defaultPatientLanguage, report } from '@shared/helpers/data';
import { calculateBPGraphMinMax } from '@shared/helpers';
import { BaseBloodPressureChart } from './base-blood-pressure-chart';
import { TranslateService } from '@ngx-translate/core';
import { IHospitalThresholdBp } from '@data/models/hospitalThresholdBp';

export class BloodPressureByDayChart extends BaseBloodPressureChart {
  public pulseAxis: am4charts.Axis | any;
  private readonly language: string = defaultPatientLanguage;
  private markerWidth = 3;

  /**
   * constructor for all charts in patient details view
   * @param containerId container id
   * @param startDate start date
   * @param endDate end date
   * @param data data sent in
   * @param patientSysGoal sys goal
   * @param patientDiaGoal dia goal
   * @param bpThreshold
   * @param translateService translate service
   * @param language
   */
  constructor(
    containerId: string,
    startDate: string | Date,
    endDate: string | Date,
    data: any,
    patientSysGoal: number,
    patientDiaGoal: number,
    bpThreshold: IHospitalThresholdBp,
    translateService: TranslateService,
    language: string
  ) {
    super(containerId, data, patientSysGoal, patientDiaGoal, translateService);
    this.endDate = endDate;
    this.startDate = startDate;
    this.bpThreshold = bpThreshold;
    this.language = language;
    this.createChart();
  }

  /**
   * create X axis
   */
  createDateAxis() {
    this.dateAxis = this.contentChart.xAxes.push(new am4charts.DateAxis());
    this.dateAxis.min = new Date(this.startDate).setHours(0, 0, 0, 0);
    this.dateAxis.max = new Date(this.endDate).setHours(0, 0, 0, 0) + 3600 * 1000 * 24;
    this.dateAxis.dateFormats.setKey('day', 'd');
    this.dateAxis.periodChangeDateFormats.setKey('day', 'd');
    this.dateAxis.renderer.grid.template.location = 0;
    this.dateAxis.renderer.width = 0;
    this.dateAxis.baseInterval = {
      timeUnit: 'hour',
      count: 1,
    };

    this.dateAxis.gridIntervals.setAll([{ timeUnit: 'day', count: 1 }]);
    this.dateAxis.renderer.cellStartLocation = 0;
    this.dateAxis.renderer.cellEndLocation = 1;
    this.dateAxis.renderer.labels.template.disabled = true;
    this.dateAxis.renderer.grid.template.fill = am4core.color('7E84A0');
    this.dateAxis.renderer.grid.template.strokeWidth = 0;
  }

  /**
   * Create Y axis for this chart
   */
  createYAxis() {
    this.contentChart.leftAxesContainer.layout = 'vertical';
    this.contentChart.rightAxesContainer.layout = 'vertical';
    this.maxSys += 3;
    this.minValue -= 3;
    this.yAxisData = calculateBPGraphMinMax(this.maxSys, this.minValue);

    // create blood pressure axis
    this.yAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    // extend the chart depending on the last grid comparing to max value of chart
    if (this.yAxisData.gridArray[9] < this.maxSys + 3) {
      this.yAxisData.gridArray.push(this.yAxisData.max);
      this.yAxis.max = this.yAxisData.max + this.yAxisData.distance / 2;
    } else {
      this.yAxis.max = this.yAxisData.max - this.yAxisData.distance / 2;
    }
    this.yAxis.min = this.yAxisData.min - (this.yAxisData.distance / 4) * 3;
    this.yAxis.strictMinMax = true;
    this.yAxis.calculateTotals = true;
    this.yAxis.renderer.labels.template.disabled = true;
    if (this.yAxis.tooltip) {
      this.yAxis.tooltip.disabled = true;
    }
    this.yAxis.height = 270;
    this.yAxis.renderer.minGridDistance = 30;
    this.yAxis.renderer.labels.template.fill = this.labelColor;
    this.yAxis.renderer.grid.template.disabled = true;
    this.yAxisData.gridArray.forEach((value) => {
      this.createAxisLabel(value);
    });

    this.pulseAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.pulseAxis.min = this.yAxis.min;
    this.pulseAxis.max = this.yAxis.max;
    this.pulseAxis.renderer.labels.template.disabled = true;
    this.pulseAxis.strictMinMax = true;
    this.pulseAxis.calculateTotals = true;
    if (this.pulseAxis.tooltip) {
      this.pulseAxis.tooltip.disabled = true;
    }
    this.pulseAxis.height = 270;
    this.pulseAxis.renderer.width = 15;
    this.pulseAxis.renderer.opposite = true;
    this.pulseAxis.renderer.grid.template.disabled = true;
    this.createGoalGrid(this.patientSysGoal);
    this.createGoalGrid(this.patientDiaGoal);
  }

  /**
   * create label for y axis of blood pressure chart
   * @param value label value
   */
  createAxisLabel(value: number): void {
    const range1 = this.yAxis.axisRanges.create();
    range1.value = value;
    range1.label.text = '{value}';
    range1.label.fontSize = this.labelFontSize;
    range1.label.fill = this.labelColor;
    range1.label.dx = 7;
    range1.grid.fill = am4core.color('#CCCCCC');

    const range2 = this.yAxis.axisRanges.create();
    range2.value = value;
    range2.grid.hidden = true;
    range2.label.text = '{value}';
    range2.label.fontSize = this.labelFontSize;
    range2.label.fill = this.labelColor;
    range2.label.dx = 474;
    range2.bullet = new am4core.Rectangle();
    range2.bullet.width = 14;
    range2.bullet.height = 8;
    range2.bullet.fill = am4core.color('white');
    range2.bullet.dy = -5;
    range2.bullet.dx = 449;

    if (value === this.patientDiaGoal || value === this.patientSysGoal) {
      range1.grid.hidden = true;
    }
  }

  /**
   * Create goal grid for Y axis
   * @param value the required customized value
   */
  public createGoalGrid(value: number): void {
    const range = this.pulseAxis.axisRanges.create();
    range.value = value;
    range.grid.stroke = this.pinkColor;
    range.label.html = `
      <div style="font-size: 7pt">${report[this.language]['goal']}</div>
      <div style="font-size: 8pt">{value}</div>`;
    range.label.dy = -8;
    range.label.fontSize = this.chartFontSize;
    range.label.fill = this.pinkColor;
    range.grid.strokeOpacity = 1;
    range.grid.strokeDasharray = '3,3';
    range.bullet = new am4core.Triangle();
    range.bullet.width = 10;
    range.bullet.height = 8;
    range.bullet.fill = this.pinkColor;
    range.bullet.rotation = 270;
    range.bullet.dy = 4.5;
  }

  /**
   * Process to create each invidual chart.
   * Process is createContentChart => load data => create Date Axis => create Y axis => create series
   */
  createChart(): void {
    super.createChart();
    this.contentChart.width = am4core.percent(92.4);
    this.contentChart.position = 'absolute';
    this.contentChart.x = 59;
    this.createLabel();
  }

  /**
   * create chart container
   */
  createContainer(): void {
    super.createContainer();
    this.container.width = am4core.percent(100);
    this.container.marginLeft = 30;
    this.container.height = 270;
  }

  /**
   * modify data to use in chart
   * @returns modified data
   */
  loadData(): any[] {
    let modifiedData: any[] = [];
    this.data.forEach((log: any) => {
      this.addToValueArray(log);
      if (log.patient_stat_sys_morning && log.patient_stat_dia_morning) {
        modifiedData.push({
          date: new Date(new Date(log.patient_stat_ldate).getTime() + 3600 * 7 * 1000),
          dia: log.patient_stat_dia_morning,
          endDia: log.patient_stat_dia_morning + this.markerWidth - 1,
          sys: log.patient_stat_sys_morning,
          fillColor: am4core.color('white'),
          borderColor: am4core.color('#A6AAB2'),
          width: this.markerWidth,
          begin: 1,
          diff: log.patient_stat_sys_morning - log.patient_stat_dia_morning - this.markerWidth * 2 + 1.5,
          upperColor: this.getUpperColor(log.patient_stat_sys_morning),
          lowerColor: this.getLowerColor(log.patient_stat_dia_morning),
          time: 'morning',
        });
      }
      if (log.patient_stat_sys_evening && log.patient_stat_dia_evening) {
        modifiedData.push({
          date: new Date(new Date(log.patient_stat_ldate).getTime() + 3600 * 16 * 1000),
          fillColor: am4core.color('#7E84A0'),
          borderColor: am4core.color('#7E84A0'),
          dia: log.patient_stat_dia_evening,
          sys: log.patient_stat_sys_evening,
          width: this.markerWidth,
          begin: 1,
          endDia: log.patient_stat_dia_evening + this.markerWidth - 1,
          diff: log.patient_stat_sys_evening - log.patient_stat_dia_evening - this.markerWidth * 2 + 1.5,
          upperColor: this.getUpperColor(log.patient_stat_sys_evening),
          lowerColor: this.getLowerColor(log.patient_stat_dia_evening),
          time: 'evening',
        });
      }
    });
    if (this.patientDiaGoal && this.patientDiaGoal !== 0) this.valueArray.push(this.patientDiaGoal);
    if (this.patientSysGoal && this.patientSysGoal !== 0) this.sysArray.push(this.patientSysGoal);
    if (this.sysArray.length !== 0) this.maxSys = Math.max(...this.sysArray);
    else this.maxSys = defaultMinMaxBP.max;
    if (this.valueArray.length !== 0) this.minValue = Math.min(...this.valueArray);
    else this.minValue = defaultMinMaxBP.min;
    return modifiedData;
  }

  /**
   * create chart series
   */
  createSeries() {
    const lowerSeries = this.contentChart.series.push(new am4charts.ColumnSeries());
    lowerSeries.yAxis = this.yAxis;
    lowerSeries.xAxis = this.dateAxis;
    lowerSeries.dataFields.dateX = 'date';
    lowerSeries.dataFields.openValueY = 'dia';
    lowerSeries.dataFields.valueY = 'endDia';
    lowerSeries.columns.template.propertyFields.fill = 'lowerColor';
    lowerSeries.columns.template.propertyFields.stroke = 'lowerColor';
    lowerSeries.columns.template.width = am4core.percent(550);
    lowerSeries.strokeWidth = 1;
    lowerSeries.stacked = true;
    lowerSeries.columns.template.column.cornerRadiusBottomLeft = 1;
    lowerSeries.columns.template.column.cornerRadiusBottomRight = 1;

    let lowerBullet = lowerSeries.bullets.push(new am4charts.LabelBullet());
    lowerBullet.label.text = '{dia}';
    lowerBullet.locationY = 4;
    lowerBullet.label.fontSize = this.chartFontSize;
    lowerBullet.label.truncate = false;
    lowerBullet.label.propertyFields.fill = 'lowerColor';

    const columnSeries = this.contentChart.series.push(new am4charts.ColumnSeries());
    columnSeries.yAxis = this.yAxis;
    columnSeries.xAxis = this.dateAxis;
    columnSeries.dataFields.dateX = 'date';
    columnSeries.dataFields.openValueY = 'begin';
    columnSeries.dataFields.valueY = 'diff';
    columnSeries.columns.template.propertyFields.fill = 'fillColor';
    columnSeries.columns.template.propertyFields.stroke = 'borderColor';
    columnSeries.strokeWidth = 1;
    columnSeries.columns.template.width = am4core.percent(550);
    columnSeries.stacked = true;

    const upperSeries = this.contentChart.series.push(new am4charts.ColumnSeries());
    upperSeries.yAxis = this.yAxis;
    upperSeries.xAxis = this.dateAxis;
    upperSeries.dataFields.dateX = 'date';
    upperSeries.dataFields.openValueY = 'begin';
    upperSeries.dataFields.valueY = 'width';
    upperSeries.columns.template.propertyFields.fill = 'upperColor';
    upperSeries.columns.template.propertyFields.stroke = 'upperColor';
    upperSeries.strokeWidth = 1;
    upperSeries.columns.template.width = am4core.percent(550);
    upperSeries.columns.template.column.cornerRadiusTopLeft = 1;
    upperSeries.columns.template.column.cornerRadiusTopRight = 1;
    upperSeries.stacked = true;

    var upperBullet = upperSeries.bullets.push(new am4charts.LabelBullet());
    upperBullet.label.text = '{sys}';
    upperBullet.locationY = -2;
    upperBullet.label.fontSize = this.chartFontSize;
    upperBullet.label.truncate = false;
    upperBullet.label.propertyFields.fill = 'upperColor';
  }
}
