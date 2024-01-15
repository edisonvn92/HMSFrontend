import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import moment from 'moment';
import { environment } from '@env/environment';
import { BloodPressureThreshold, defaultMinMaxBP } from '@shared/helpers/data';
import { TranslateService } from '@ngx-translate/core';
import { getReportBPIconTarget } from '@shared/helpers';
import { IHospitalThresholdBp } from '@data/models/hospitalThresholdBp';
import setting from '@data/json/hospitalSetting.json';

export class BaseBloodPressureChart {
  public container: am4core.Container | any;
  public containerId: string = '';
  public contentChart: am4charts.XYChart | any;
  public data: any;
  public startDate: string | Date = new Date(moment().startOf('month').toString());
  public endDate: string | Date = new Date();
  public maxValue: number = 0;
  public translate: TranslateService;

  public patientSysGoal: number = setting.default_hospital_setting_bp.sys_goal;
  public patientDiaGoal: number = setting.default_hospital_setting_bp.dia_goal;

  //variable to calculate min max for axis
  minValue: number = defaultMinMaxBP.max;
  maxSys: number = defaultMinMaxBP.min;
  valueArray: number[] = [];
  sysArray: number[] = [];
  yAxisData = {
    min: 0,
    max: 0,
    distance: 0,
    gridArray: [] as number[],
  };
  bpThreshold: IHospitalThresholdBp = {
    hospital_threshold_bp_black_dia: BloodPressureThreshold.diff_dia_2,
    hospital_threshold_bp_black_sys: BloodPressureThreshold.diff_sys_2,
    hospital_threshold_bp_dark_red_dia: BloodPressureThreshold.diff_dia_1,
    hospital_threshold_bp_dark_red_sys: BloodPressureThreshold.diff_sys_1,
  };

  chartFontSize = '7pt';
  labelFontSize = '6.5pt';

  public dateAxis: am4charts.Axis | any;
  public yAxis: am4charts.Axis | any;
  public pulseAxis: am4charts.Axis | any;

  pinkColor = am4core.color('#DB4A86');
  labelColor = am4core.color('#7F7F7F');
  textColor = am4core.color('#7E84A0');

  /**
   * constructor for blood pressure chart in report
   * @param containerId id of chart container
   * @param data data sent in
   * @param patientSysGoal sys goal value
   * @param patientDiaGoal dia goal value
   * @param translateService translate service
   */
  constructor(
    containerId: string,
    data: any,
    patientSysGoal: number,
    patientDiaGoal: number,
    translateService: TranslateService
  ) {
    this.containerId = containerId;
    am4core.addLicense(environment.amchart_license_code);
    this.translate = translateService;
    am4core.options.autoSetClassName = true;
    this.data = data;
    this.patientSysGoal = patientSysGoal;
    this.patientDiaGoal = patientDiaGoal;
    this.createContainer();
  }

  /**
   * base to create X axis for this chart
   */
  createDateAxis() {}

  /**
   * base to create Y axis for this chart
   */
  createYAxis() {}

  /**
   * create label for y axis of blood pressure chart
   * @param value label value
   */
  createAxisLabel(value: number): void {}

  /**
   * Create goal grid for Y axis
   * @param value the required customized value
   */
  createGoalGrid(value: number): void {}

  /**
   * Process to create each invidual chart.
   * Process is createContentChart => load data => create Date Axis => create Y axis => create series
   */
  createChart(): void {
    this.contentChart = this.container.createChild(am4charts.XYChart);
    this.contentChart.data = this.loadData();
    // set up x axis (date axis)
    this.createDateAxis();
    this.createYAxis();
    this.createSeries();
  }

  /**
   * create chart container
   */
  createContainer(): void {
    this.container = am4core.create(this.containerId, am4core.Container);
  }

  /**
   * modify data to use in chart
   * @returns modified data
   */
  loadData(): any[] {
    return [];
  }

  /**
   * base to create series
   */
  createSeries() {}

  /**
   * get color for upper series
   * @param sysValue sys value
   * @returns color representing the status of data
   */
  getUpperColor(sysValue: number) {
    return am4core.color(
      getReportBPIconTarget(
        sysValue,
        this.patientSysGoal,
        this.bpThreshold.hospital_threshold_bp_black_sys,
        this.bpThreshold.hospital_threshold_bp_dark_red_sys
      ).color
    );
  }

  /**
   * get color for lower series
   * @param diaValue dia value
   * @returns color representing the status of data
   */
  getLowerColor(diaValue: number) {
    return am4core.color(
      getReportBPIconTarget(
        diaValue,
        this.patientDiaGoal,
        this.bpThreshold.hospital_threshold_bp_black_dia,
        this.bpThreshold.hospital_threshold_bp_dark_red_dia
      ).color
    );
  }

  /**
   * get the data to the private value array
   * @param log data log
   */
  addToValueArray(log: any) {
    if (log.patient_stat_sys_morning) {
      this.valueArray.push(log.patient_stat_sys_morning);
      this.sysArray.push(log.patient_stat_sys_morning);
    }
    if (log.patient_stat_dia_morning) {
      this.valueArray.push(log.patient_stat_dia_morning);
    }
    if (log.patient_stat_sys_evening) {
      this.valueArray.push(log.patient_stat_sys_evening);
      this.sysArray.push(log.patient_stat_sys_evening);
    }
    if (log.patient_stat_dia_evening) {
      this.valueArray.push(log.patient_stat_dia_evening);
    }
  }

  /**
   * create mmHg label for chart
   */
  createLabel() {
    const axisTitle = this.container.createChild(am4core.Label);
    axisTitle.text = '[[mmHg]]';
    axisTitle.align = 'center';
    axisTitle.isMeasured = false;
    axisTitle.x = 70;
    axisTitle.y = 5;
    axisTitle.fontSize = this.chartFontSize;
    axisTitle.fill = this.textColor;
  }
}
