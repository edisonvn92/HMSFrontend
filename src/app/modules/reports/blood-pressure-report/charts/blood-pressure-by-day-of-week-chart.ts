import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import { TranslateService } from '@ngx-translate/core';
import { ValueAxisDataItem } from '@amcharts/amcharts4/charts';
import { defaultMinMaxBP, defaultPatientLanguage, report } from '@shared/helpers/data';
import { calculateBPGraphMinMax, calculateBPGraphMinMaxSecondFormula } from '@shared/helpers';
import { BaseBloodPressureChart } from './base-blood-pressure-chart';

export class BloodPressureByDayOfWeekChart extends BaseBloodPressureChart {
  oppositeYAxis: am4charts.Axis | any;

  private normalColor = am4core.color('#000000d9');
  private morningStroke = am4core.color('#66acec');
  private morningFill = am4core.color('#8ec7f4');
  private eveningStroke = am4core.color('#90b3ea');
  private eveningFill = am4core.color('#6696e2');
  private rangeStroke = am4core.color('#B2B2B2');
  private readonly language: string = defaultPatientLanguage;

  /**
   * constructor for all charts in patient details view
   * @param containerId container id
   * @param startDate start date
   * @param endDate end date
   * @param data data sent in
   * @param patientSysGoal sys goal
   * @param patientDiaGoal dia goal
   * @param translate
   * @param language
   */
  constructor(
    containerId: string,
    startDate: string | Date,
    endDate: string | Date,
    data: any,
    patientSysGoal: number,
    patientDiaGoal: number,
    translate: TranslateService,
    language: string
  ) {
    super(containerId, data, patientSysGoal, patientDiaGoal, translate);
    this.endDate = endDate;
    this.startDate = startDate;
    this.language = language;
    this.createChart();
  }

  /**
   * create label for X Axis
   * @param xAxis x axis
   * @param category category name
   * @param label label text
   * @param option option
   */
  createXLabel(xAxis: am4charts.CategoryAxis, category: string, label: string, option?: any) {
    const range = xAxis.axisRanges.create();
    range.category = category;
    range.grid.strokeOpacity = 0;
    range.label.dataItem.text = label;
    range.label.fontSize = '14pt';
    range.label.fill = option?.label_fill ? option.label_fill : am4core.color('#000000d9');
    range.grid.stroke = option?.color ? option?.color : am4core.color('#B2B2B2');
    range.grid.strokeOpacity = option?.opacity !== undefined ? option?.opacity : 1;
    range.grid.strokeWidth = option?.stroke_width !== undefined ? option.stroke_width : 1;
  }

  /**
   * Create X axis for this chart
   */
  createDateAxis() {
    this.dateAxis = this.contentChart.xAxes.push(new am4charts.CategoryAxis());
    this.dateAxis.renderer.grid.template.location = 0;
    this.dateAxis.renderer.labels.template.disabled = true;
    this.dateAxis.renderer.grid.template.disabled = true;
    this.dateAxis.dataFields.category = 'patient_stat_day';
    this.dateAxis.renderer.minGridDistance = 60;

    this.contentChart.data.forEach((data: any) => {
      this.createXLabel(this.dateAxis, data.patient_stat_day, data.day_of_week, {
        label_fill: data.patient_stat_day === '1' ? this.pinkColor : this.normalColor,
        stroke_width: data.patient_stat_day === '1' ? 1 : 0,
      });
    });
  }

  /**
   * Create Y axis for this chart
   */
  createYAxis() {
    // create blood pressure axis
    this.yAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.yAxisData = calculateBPGraphMinMax(this.maxSys, this.minValue);
    if (this.maxSys > this.yAxisData.gridArray[9]) {
      this.yAxisData = calculateBPGraphMinMaxSecondFormula(this.maxSys, this.minValue);
    }
    this.yAxis.min = this.yAxisData.min;
    this.yAxis.max = this.yAxisData.gridArray[9];
    this.yAxis.strictMinMax = true;
    this.yAxis.calculateTotals = true;
    this.yAxis.renderer.labels.template.disabled = true;
    this.yAxis.renderer.grid.template.disabled = true;
    this.yAxis.renderer.line.strokeOpacity = 1;
    this.yAxis.renderer.line.strokeWidth = 1;
    this.yAxis.renderer.line.stroke = this.rangeStroke;
    if (this.yAxis.tooltip) {
      this.yAxis.tooltip.disabled = true;
    }
    this.yAxis.renderer.minGridDistance = 20;
    this.yAxis.renderer.labels.template.fill = this.labelColor;

    // create range for sys/dis target
    [this.patientSysGoal, this.patientDiaGoal].forEach((goal: number) => {
      if (goal) {
        this.createHorizontalGrid(this.yAxis, goal, {
          color: this.pinkColor,
          opacity: 1,
          stroke_dasharray: '4',
          label_fill: this.pinkColor,
          stroke_width: 1.5,
        });
      }
    });

    // create range
    this.yAxisData.gridArray.forEach((value: number, index: number) => {
      if (![this.patientSysGoal, this.patientDiaGoal].includes(value)) {
        this.createHorizontalGrid(this.yAxis, value, { opacity: 1, hidden_label: !(index % 2) });
      }
    });

    // create opposite axis
    this.oppositeYAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.oppositeYAxis.renderer.labels.template.disabled = true;
    this.oppositeYAxis.renderer.opposite = true;
    this.oppositeYAxis.renderer.line.strokeOpacity = 1;
    this.oppositeYAxis.renderer.line.strokeWidth = 1;
    this.oppositeYAxis.renderer.line.stroke = this.rangeStroke;
    this.oppositeYAxis.renderer.grid.template.disabled = true;
  }

  /**
   * Process to create each individual chart.
   * Process is createContentChart => load data => create Date Axis => create Y axis => create series
   */
  createChart(): void {
    super.createChart();
  }

  /**
   * Create chart container
   */
  createContainer(): void {
    super.createContainer();
    this.container.width = am4core.percent(100);
    this.container.height = am4core.percent(100);
  }

  /**
   * Get day of week follow day index
   * @param dayOfWeek
   */
  getDayOfWeek(dayOfWeek: number): string {
    switch (dayOfWeek) {
      case 1:
        return 'sunday';
      case 2:
        return 'monday';
      case 3:
        return 'tuesday';
      case 4:
        return 'wednesday';
      case 5:
        return 'thursday';
      case 6:
        return 'friday';
      case 7:
        return 'saturday';
      default:
        return '';
    }
  }

  /**
   * Handle data for chart
   */
  loadData(): any[] {
    let modifiedData: any[] = [];

    let dataArray: any = [];
    Array.from(Array(7).keys()).forEach((number) => {
      dataArray.push({
        patient_stat_day: number + 1,
      });
    });

    this.data.forEach((dataInDay: any) => {
      dataArray[dataInDay.patient_stat_day - 1] = dataInDay;
    });

    dataArray.forEach((dataInDay: any) => {
      this.addToValueArray(dataInDay);
      modifiedData.push({
        day_of_week: report[this.language]['day_of_week'][this.getDayOfWeek(dataInDay.patient_stat_day)],
        day_color: dataInDay.patient_stat_day === 1 ? this.pinkColor : this.normalColor,
        patient_stat_day: dataInDay.patient_stat_day ? dataInDay.patient_stat_day.toString() : '',
        patient_stat_dia_evening: dataInDay.patient_stat_dia_evening
          ? Number(dataInDay.patient_stat_dia_evening)
          : null,
        patient_stat_dia_morning: dataInDay.patient_stat_dia_morning
          ? Number(dataInDay.patient_stat_dia_morning)
          : null,
        patient_stat_pulse_evening: dataInDay.patient_stat_pulse_evening
          ? Number(dataInDay.patient_stat_pulse_evening)
          : null,
        patient_stat_pulse_morning: dataInDay.patient_stat_pulse_morning
          ? Number(dataInDay.patient_stat_pulse_morning)
          : null,
        patient_stat_sys_evening: dataInDay.patient_stat_sys_evening
          ? Number(dataInDay.patient_stat_sys_evening)
          : null,
        patient_stat_sys_morning: dataInDay.patient_stat_sys_morning
          ? Number(dataInDay.patient_stat_sys_morning)
          : null,
      });
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
   * Create line series
   * @param valueY
   * @param option
   */
  createLineSeries(valueY: string, option?: any): any {
    const series = this.contentChart.series.push(new am4charts.LineSeries());
    series.yAxis = this.yAxis;
    series.xAxis = this.dateAxis;
    series.dataFields.categoryX = 'patient_stat_day';
    series.dataFields.valueY = valueY;
    series.stroke = option?.stroke || this.morningStroke;

    let maker = series.bullets.push(new am4core.Rectangle());
    maker.width = 10;
    maker.height = 10;
    maker.strokeWidth = 1;
    maker.radius = 4;
    maker.fill = option?.fill || this.morningFill;
    maker.stroke = option?.stroke || this.morningStroke;
    maker.dy = option?.dy || 0;
    maker.dx = option?.dx || 0;
    maker.rotation = option?.rotation || 0;
    return series;
  }

  /**
   * Create all series
   */
  createSeries() {
    this.createLineSeries('patient_stat_sys_evening', {
      fill: this.eveningFill,
      stroke: this.eveningStroke,
      dy: -5,
      dx: -4.5,
    });
    this.createLineSeries('patient_stat_sys_morning', {
      fill: this.morningFill,
      stroke: this.morningStroke,
      dy: -7,
      dx: 1,
      rotation: 45,
    });
    this.createLineSeries('patient_stat_dia_evening', {
      fill: this.eveningFill,
      stroke: this.eveningStroke,
      dy: -5,
      dx: -4.5,
    });
    this.createLineSeries('patient_stat_dia_morning', {
      fill: this.morningFill,
      stroke: this.morningStroke,
      dy: -7,
      dx: 1,
      rotation: 45,
    });
  }

  /**
   * Create customized label/grid for Y axis
   * @param yAxis Y axis of the chart
   * @param value the required customized value
   * @param option
   */
  public createHorizontalGrid(yAxis: am4charts.ValueAxis, value: number, option?: any): ValueAxisDataItem {
    const range = yAxis.axisRanges.create();
    range.value = value;
    range.grid.stroke = option?.color ? option?.color : this.rangeStroke;
    range.grid.strokeOpacity = option?.opacity !== undefined ? option?.opacity : 1;
    range.grid.strokeWidth = option?.stroke_width !== undefined ? option.stroke_width : 1;
    range.label.fill = option?.label_fill !== undefined ? option.label_fill : am4core.color('#7f7f7f');
    range.label.fontSize = '12pt';
    if (!option?.hidden_label) {
      range.label.text = '{value}';
    }
    if (option?.stroke_dasharray) {
      range.grid.strokeDasharray = option.stroke_dasharray;
    }
    return range;
  }
}
