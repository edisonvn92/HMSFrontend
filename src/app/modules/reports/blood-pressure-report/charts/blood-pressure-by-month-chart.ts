import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { calculateBPGraphMinMax } from '@shared/helpers';
import { BaseBloodPressureChart } from './base-blood-pressure-chart';
import { TranslateService } from '@ngx-translate/core';
import { IHospitalThresholdBp } from '@data/models/hospitalThresholdBp';
import { defaultPatientLanguage, report } from '@shared/helpers/data';

export class BloodPressureByMonthChart extends BaseBloodPressureChart {
  private readonly language: string = defaultPatientLanguage;
  markerWidth = 3;

  /**
   * constructor for all charts in patient details view
   * @param containerId container id
   * @param data data sent in
   * @param average average value in last chart
   * @param patientSysGoal sys goal
   * @param patientDiaGoal dia goal
   * @param bpThreshold
   * @param translate
   * @param language
   */
  constructor(
    containerId: string,
    data: any,
    average: any,
    patientSysGoal: number,
    patientDiaGoal: number,
    bpThreshold: IHospitalThresholdBp,
    public translate: TranslateService,
    language: string
  ) {
    super(containerId, data, patientSysGoal, patientDiaGoal, translate);
    this.bpThreshold = bpThreshold;
    this.language = language;
    this.data = Array.from(data);
    this.data.push(average);
    this.createChart();
  }

  /**
   * create X Axis
   */
  createDateAxis() {
    this.dateAxis = this.contentChart.xAxes.push(new am4charts.CategoryAxis());
    this.dateAxis.renderer.cellStartLocation = 0.15;
    this.dateAxis.renderer.cellEndLocation = 0.85;
    this.dateAxis.renderer.labels.template.disabled = true;
    this.dateAxis.renderer.grid.template.disabled = true;
    this.dateAxis.dataFields.category = 'month';
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
    range1.label.dx = 0;
    range1.grid.fill = am4core.color('#CCCCCC');

    const range2 = this.yAxis.axisRanges.create();
    range2.value = value;
    range2.grid.hidden = true;
    range2.label.text = '{value}';
    range2.label.fontSize = this.labelFontSize;
    range2.label.fill = this.labelColor;
    range2.label.dx = 427;
    range2.bullet = new am4core.Rectangle();
    range2.bullet.width = 15;
    range2.bullet.height = 8;
    range2.bullet.fill = am4core.color('white');
    range2.bullet.dy = -5;
    range2.bullet.dx = 402;

    if (value === this.patientDiaGoal || value === this.patientSysGoal) {
      range1.grid.hidden = true;
      range2.grid.hidden = true;
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
    range.label.dx = -135;
    range.label.dy = -7;
    range.label.fontSize = this.chartFontSize;
    range.label.fill = this.pinkColor;
    range.grid.strokeOpacity = 1;
    range.grid.strokeDasharray = '3,3';
    range.bullet = new am4charts.Bullet();
    let triangle = range.bullet.createChild(am4core.Triangle);
    triangle.width = 10;
    triangle.height = 8;
    triangle.fill = this.pinkColor;
    triangle.rotation = 270;
    triangle.dy = 4.5;
    triangle.dx = -135;

    let rectangle = range.bullet.createChild(am4core.Rectangle);
    rectangle.width = 20;
    rectangle.height = 24;
    rectangle.fill = am4core.color('white');
    rectangle.dy = -19;
    rectangle.dx = -125;
  }

  /**
   * Process to create each invidual chart.
   * Process is createContentChart => load data => create Date Axis => create Y axis => create series
   */
  createChart(): void {
    super.createChart();
    this.contentChart.position = 'absolute';
    this.contentChart.width = am4core.percent(96.6);
    this.contentChart.x = 72;
    this.createLabel();
  }

  /**
   * create chart container
   */
  createContainer(): void {
    super.createContainer();
    this.container.width = am4core.percent(100);
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
      let data: any = {
        month: log.monthYear,
        width: this.markerWidth,
        begin: 1,
        endEvening: this.markerWidth,
        colorMorning: am4core.color('white'),
        borderColorMorning: am4core.color('#A6AAB2'),
        colorEvening: am4core.color('#7E84A0'),
      };
      if (log.patient_stat_sys_morning && log.patient_stat_dia_morning) {
        data.startDiaMorning = log.patient_stat_dia_morning;
        data.endDiaMorning = log.patient_stat_dia_morning + this.markerWidth - 1;
        data.diaMorning = log.patient_stat_dia_morning;
        data.sysMorning = log.patient_stat_sys_morning;
        data.diffMorning = log.patient_stat_sys_morning - log.patient_stat_dia_morning - this.markerWidth * 2 + 1.3;
        data.upperColorMorning = this.getUpperColor(log.patient_stat_sys_morning);
        data.lowerColorMorning = this.getLowerColor(log.patient_stat_dia_morning);
      }
      if (log.patient_stat_sys_evening && log.patient_stat_dia_evening) {
        data.startDiaEvening = log.patient_stat_dia_evening;
        data.endDiaEvening = log.patient_stat_dia_evening + this.markerWidth - 1;
        data.diaEvening = log.patient_stat_dia_evening;
        data.sysEvening = log.patient_stat_sys_evening;
        data.diffEvening = log.patient_stat_sys_evening - log.patient_stat_dia_evening - this.markerWidth * 2 + 1.3;
        data.upperColorEvening = this.getUpperColor(log.patient_stat_sys_evening);
        data.lowerColorEvening = this.getLowerColor(log.patient_stat_dia_evening);
      }
      modifiedData.push(data);
    });
    if (this.patientDiaGoal && this.patientDiaGoal !== 0) this.valueArray.push(this.patientDiaGoal);
    if (this.patientSysGoal && this.patientSysGoal !== 0) this.sysArray.push(this.patientSysGoal);
    if (this.sysArray.length !== 0) this.maxSys = Math.max(...this.sysArray);
    else this.maxSys = 258;
    if (this.valueArray.length !== 0) this.minValue = Math.min(...this.valueArray);
    else this.minValue = 25;
    return modifiedData;
  }

  /**
   * create column series
   */
  createSeries() {
    let lowerMorningSeries = this.createColumn(
      'startDiaMorning',
      'endDiaMorning',
      'lowerColorMorning',
      'lowerColorMorning',
      false,
      'lower'
    );
    this.createNumberBullet(lowerMorningSeries, '{diaMorning}', 3, 'lowerColorMorning');
    this.createColumn('begin', 'diffMorning', 'colorMorning', 'borderColorMorning', true, 'middle');
    let upperMorningSeries = this.createColumn(
      'begin',
      'width',
      'upperColorMorning',
      'upperColorMorning',
      true,
      'upper'
    );
    this.createNumberBullet(upperMorningSeries, '{sysMorning}', -2, 'upperColorMorning');
    let lowerEveningSeries = this.createColumn(
      'startDiaEvening',
      'endDiaEvening',
      'lowerColorEvening',
      'lowerColorEvening',
      false,
      'lower'
    );
    this.createNumberBullet(lowerEveningSeries, '{diaEvening}', 3, 'lowerColorEvening');
    this.createColumn('begin', 'diffEvening', 'colorEvening', 'colorEvening', true, 'middle');
    let upperEveningSeries = this.createColumn(
      'begin',
      'endEvening',
      'upperColorEvening',
      'upperColorEvening',
      true,
      'upper'
    );
    this.createNumberBullet(upperEveningSeries, '{sysEvening}', -2, 'upperColorEvening');
  }

  /**
   * create column for the chart (can be stacked column)
   * @param start start field for column
   * @param length length of column
   * @param fillColor fill color of column
   * @param strokeColor stroke color of column
   * @param stacked whether the column is stacked or not
   * @param type type of column, whether it is upper, middle or lower column
   * @returns column created
   */
  private createColumn(
    start: string,
    length: string,
    fillColor: string,
    strokeColor: string,
    stacked: boolean,
    type: string
  ): any {
    var series = this.contentChart.series.push(new am4charts.ColumnSeries());
    series.xAxis = this.dateAxis;
    series.yAxis = this.yAxis;
    series.dataFields.valueY = length;
    series.dataFields.openValueY = start;
    series.dataFields.categoryX = 'month';
    series.stacked = stacked;
    series.strokeWidth = 1;
    series.columns.template.propertyFields.fill = fillColor;
    series.columns.template.propertyFields.stroke = strokeColor;
    series.columns.template.width = am4core.percent(50);
    if (type == 'lower') {
      series.columns.template.column.cornerRadiusBottomLeft = 2;
      series.columns.template.column.cornerRadiusBottomRight = 2;
    } else if (type == 'upper') {
      series.columns.template.column.cornerRadiusTopLeft = 2;
      series.columns.template.column.cornerRadiusTopRight = 2;
    }
    series.columns.template.adapter.add('dx', function (dx: any, target: any) {
      if (target.dataItem && target.dataItem.categoryX == 'average') {
        return 16;
      }
      return dx;
    });
    return series;
  }

  /**
   * create number for series
   * @param series series needed for number
   * @param textOrigin datafield to get the value shown
   * @param location location of text
   * @param color color of text
   */
  private createNumberBullet(series: any, textOrigin: string, location: number, color: string) {
    let numberBullet = series.bullets.push(new am4charts.LabelBullet());
    numberBullet.label.text = textOrigin;
    numberBullet.locationY = location;
    numberBullet.label.fontSize = this.chartFontSize;
    numberBullet.label.truncate = false;
    numberBullet.label.propertyFields.fill = color;
    numberBullet.adapter.add('dx', function (dx: any, target: any) {
      if (target.dataItem && target.dataItem.categoryX == 'average') {
        return 16;
      }
      return dx;
    });
  }
}
