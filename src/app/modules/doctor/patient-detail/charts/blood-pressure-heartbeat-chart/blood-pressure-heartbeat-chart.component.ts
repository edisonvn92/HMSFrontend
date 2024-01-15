import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseChart } from '../base-chart';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import {
  calculateBPGraphMinMax,
  calculateBPGraphMinMaxSecondFormula,
  checkBloodPressureDataNotNull,
} from '@shared/helpers';
import setting from '@data/json/hospitalSetting.json';

@Component({
  selector: 'app-blood-pressure-heartbeat-chart',
  templateUrl: './blood-pressure-heartbeat-chart.component.html',
  styleUrls: ['./blood-pressure-heartbeat-chart.component.scss'],
})
export class BloodPressureHeartbeatChartComponent implements OnInit, OnChanges {
  @Input() startDate: string | Date = new Date();
  @Input() endDate: string | Date = new Date();
  @Input() bloodPressureTarget: any = {
    patient_sys_goal: setting.default_hospital_setting_bp.sys_goal,
    patient_dia_goal: setting.default_hospital_setting_bp.dia_goal,
  };
  @Input() patient: any;
  @Input() showHospitalVisit = false;
  @Output() openBloodPressureTarget: EventEmitter<any> = new EventEmitter<any>();
  @Output() openHomeBloodPressureHistory: EventEmitter<any> = new EventEmitter<any>();

  clickedData: any;
  currentData: any;
  showPopup = false;
  popupPosition = 0;
  bloodPressurePulseChart: BloodPressurePulseChart | any;
  showChart = true;

  constructor(private translateService: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if the period changes reboot the whole chart
    // create chart when new data arrive
    if (changes.patient && this.bloodPressurePulseChart) {
      this.bloodPressurePulseChart.patient_sys_goal = this.bloodPressureTarget.patient_sys_goal;
      this.bloodPressurePulseChart.patient_dia_goal = this.bloodPressureTarget.patient_dia_goal;
      this.bloodPressurePulseChart.showHospitalVisit = this.showHospitalVisit;
      this.bloodPressurePulseChart.data = this.patient;
      this.loadChart();
      this.bloodPressurePulseChart.createChart();
      this.bloodPressurePulseChart.openDailyModal = this.openDailyVitalModal;
    }

    // change goal grid if new target is released
    if (changes.bloodPressureTarget && this.bloodPressurePulseChart) {
      this.bloodPressurePulseChart.showHospitalVisit = this.showHospitalVisit;
      this.bloodPressurePulseChart.patient_sys_goal = this.bloodPressureTarget.patient_sys_goal;
      this.bloodPressurePulseChart.patient_dia_goal = this.bloodPressureTarget.patient_dia_goal;
      this.bloodPressurePulseChart.recreateGoalGrid(true);
    }
  }

  ngOnInit(): void {
    this.bloodPressurePulseChart = new BloodPressurePulseChart(
      this.startDate,
      this.endDate,
      'bloodPressurePulseChartBody',
      this.translateService
    );
  }

  /**
   * open detail popup
   * @param cursorPosition cursor position sent from chart
   */
  openDailyVitalModal = (cursorPosition: any) => {
    this.clickedData = Object.values(this.patient).find((log: any) => {
      if (log.vital_office_utc_time) {
        return moment(log.vital_office_utc_time).isSame(moment(cursorPosition.x), 'day');
      } else if (log.patient_stat_ldate) {
        return moment(log.patient_stat_ldate).isSame(moment(cursorPosition.x), 'day');
      } else return false;
    });
    if (JSON.stringify(this.clickedData) !== JSON.stringify(this.currentData)) {
      this.popupPosition = cursorPosition.position;
      this.currentData = this.clickedData;
    }
    if (this.clickedData && checkBloodPressureDataNotNull(this.clickedData)) this.showPopup = true;
    else this.showPopup = false;
  };

  /**
   * load chart by disposing old chart and create new chart
   */
  loadChart() {
    if (this.bloodPressurePulseChart) {
      this.bloodPressurePulseChart.dispose();
      this.bloodPressurePulseChart.startDate = this.startDate;
      this.bloodPressurePulseChart.endDate = this.endDate;
      this.bloodPressurePulseChart.boot();
    }
  }

  /**
   * function when toggle show hide button
   */
  toggleChart() {
    this.showChart = !this.showChart;
    this.showPopup = false;
    if (this.showChart) {
      this.bloodPressurePulseChart.contentChart.show();
    } else {
      this.bloodPressurePulseChart.contentChart.hide();
    }
  }
}

export class BloodPressurePulseChart extends BaseChart {
  public patient_sys_goal: number = 0;
  public patient_dia_goal: number = 0;
  public openDailyModal: ((data: any) => {}) | any;
  public showHospitalVisit = false;

  private secondaryXAxis: am4charts.Axis | any;
  private bloodPressureAxis: am4charts.Axis | any;
  private pulseAxis: am4charts.Axis | any;
  private measurementStateAxis: am4charts.Axis | any;
  private consultationDateAxis: am4charts.Axis | any;
  private cursorPosition: any = { x: 0, y: 0, position: 0 };

  //variable to calculate min max for axis
  private minValue: number = 285;
  private maxSys: number = 25;
  private valueArray: number[] = [];
  private sysArray: number[] = [];
  private yAxisData = {
    min: 0,
    max: 0,
    gridArray: [] as number[],
  };

  createChartContainer(containerId: string) {
    super.createChartContainer(containerId);
    this.createChartLabels();
  }

  /**
   * create label on the top of chart1
   */
  createChartLabels() {
    const topContainer = this.chartContainer.createChild(am4core.Container);
    topContainer.layout = 'absolute';
    topContainer.toBack();
    topContainer.width = am4core.percent(100);

    const axisTitle2 = topContainer.createChild(am4core.Label);
    axisTitle2.text = '[[mmHg]]';
    axisTitle2.align = 'left';
    axisTitle2.paddingTop = 5;
    axisTitle2.paddingLeft = 30;
    axisTitle2.fontSize = 12;
    axisTitle2.fill = am4core.color('#7C8E99');

    const axisTitle4 = topContainer.createChild(am4core.Label);
    axisTitle4.text = '[[bpm]]';
    axisTitle4.align = 'right';
    axisTitle4.paddingTop = 5;
    axisTitle4.marginRight = 0;
    axisTitle4.fontSize = 12;
    axisTitle4.fill = am4core.color('#7C8E99');
  }

  /**
   * organize data to prepare for chart
   * @returns organized data
   */
  loadData(): any[] {
    let modifiedData: any[] = [];
    this.valueArray = [];
    this.sysArray = [];
    const dataArray = Object.values(this.data) as any[];
    dataArray
      .sort((log1, log2) => {
        let date1 = log1.patient_stat_ldate
          ? moment(log1.patient_stat_ldate).toDate()
          : moment(log1.vital_office_utc_time).toDate();
        let date2 = log2.patient_stat_ldate
          ? moment(log2.patient_stat_ldate).toDate()
          : moment(log2.vital_office_utc_time).toDate();
        return date1.getTime() - date2.getTime();
      })
      .forEach((log: any) => {
        this.addToValueArray(log);
        if (checkBloodPressureDataNotNull(log)) {
          if (log.vital_office_utc_time) {
            let officeDate = log.vital_office_utc_time.split('T')[0];
            let currentDate = log.patient_stat_ldate ? log.patient_stat_ldate : officeDate;
            let data1Day: any[] = [];
            if (log.patient_stat_sys_morning || log.patient_stat_dia_morning || log.patient_stat_pulse_morning) {
              data1Day.push({
                date: moment(`${currentDate} 05:00:00`).toDate(),
                sys: log.patient_stat_sys_morning,
                dia: log.patient_stat_dia_morning,
                pulse: log.patient_stat_pulse_morning,
                color: am4core.color('#306F95'),
              });
            }
            data1Day.push({
              date: moment(`${currentDate} 12:00:00`).toDate(),
              sys: log.vital_office_systolic,
              dia: log.vital_office_diastolic,
              pulse: log.vital_office_pulse,
              color: am4core.color('#999999'),
            });
            if (log.patient_stat_sys_evening || log.patient_stat_dia_evening || log.patient_stat_pulse_evening) {
              data1Day.push({
                sys: log.patient_stat_sys_evening,
                dia: log.patient_stat_dia_evening,
                date: moment(`${currentDate} 19:00:00`).toDate(),
                pulse: log.patient_stat_pulse_evening,
                color: am4core.color('#003153'),
              });
            }
            if (data1Day.length > 0) {
              this.setDataForActionSeries(data1Day[0], log);
              data1Day[0].value_office = 1;
            } else if (
              (log.user_stat_ihb !== undefined && log.user_stat_ihb !== null) ||
              (log.user_stat_body_motion !== undefined && log.user_stat_body_motion !== null) ||
              (log.user_stat_tight_fit !== undefined && log.user_stat_tight_fit !== null)
            ) {
              let data = { date: moment(`${log.patient_stat_ldate} 08:00:00`).toDate() };
              this.setDataForActionSeries(data, log);
              data1Day.push(data);
            }
            modifiedData = modifiedData.concat(data1Day);
          } else if (log.patient_stat_ldate) {
            let data1Day: any[] = [];
            if (log.patient_stat_sys_morning || log.patient_stat_dia_morning || log.patient_stat_pulse_morning) {
              data1Day.push({
                date: moment(`${log.patient_stat_ldate} 08:00:00`).toDate(),
                sys: log.patient_stat_sys_morning,
                dia: log.patient_stat_dia_morning,
                pulse: log.patient_stat_pulse_morning,
                color: am4core.color('#306F95'),
              });
            }
            if (log.patient_stat_sys_evening || log.patient_stat_dia_evening || log.patient_stat_pulse_evening) {
              data1Day.push({
                sys: log.patient_stat_sys_evening,
                dia: log.patient_stat_dia_evening,
                date: moment(`${log.patient_stat_ldate} 15:00:00`).toDate(),
                pulse: log.patient_stat_pulse_evening,
                color: am4core.color('#003153'),
              });
            }
            if (data1Day.length > 0) this.setDataForActionSeries(data1Day[0], log);
            else if (
              (log.user_stat_ihb !== undefined && log.user_stat_ihb !== null) ||
              (log.user_stat_body_motion !== undefined && log.user_stat_body_motion !== null) ||
              (log.user_stat_tight_fit !== undefined && log.user_stat_tight_fit !== null)
            ) {
              let data = { date: moment(`${log.patient_stat_ldate} 08:00:00`).toDate() };
              this.setDataForActionSeries(data, log);
              data1Day.push(data);
            }
            modifiedData = modifiedData.concat(data1Day);
          }
        }
      });
    if (this.patient_dia_goal && this.patient_dia_goal !== 0) this.valueArray.push(this.patient_dia_goal);
    if (this.patient_sys_goal && this.patient_sys_goal !== 0) this.sysArray.push(this.patient_sys_goal);
    if (this.sysArray.length !== 0) this.maxSys = Math.max(...this.sysArray);
    else this.maxSys = 258;
    if (this.valueArray.length !== 0) this.minValue = Math.min(...this.valueArray);
    else this.minValue = 25;
    return modifiedData;
  }

  /**
   * add action series value to chart data
   * @param data data for chart
   * @param log data sent in
   */
  private setDataForActionSeries(data: any, log: any) {
    data.value1 = 3;
    data.ihb = log.user_stat_ihb;
    data.value2 = 2;
    data.body_motion = log.user_stat_body_motion;
    data.value3 = 1;
    data.tight_fit = log.user_stat_tight_fit;
  }

  /**
   * get the data to the private value array
   * @param log data log
   */
  private addToValueArray(log: any) {
    if (log.patient_stat_sys_morning) {
      this.valueArray.push(log.patient_stat_sys_morning);
      this.sysArray.push(log.patient_stat_sys_morning);
    }
    if (log.patient_stat_dia_morning) {
      this.valueArray.push(log.patient_stat_dia_morning);
    }
    if (log.patient_stat_pulse_morning) {
      this.valueArray.push(log.patient_stat_pulse_morning);
    }
    if (log.vital_office_systolic) {
      this.valueArray.push(log.vital_office_systolic);
      this.sysArray.push(log.vital_office_systolic);
    }
    if (log.vital_office_diastolic) {
      this.valueArray.push(log.vital_office_diastolic);
    }
    if (log.vital_office_pulse) {
      this.valueArray.push(log.vital_office_pulse);
    }
    if (log.patient_stat_sys_evening) {
      this.valueArray.push(log.patient_stat_sys_evening);
      this.sysArray.push(log.patient_stat_sys_evening);
    }
    if (log.patient_stat_dia_evening) {
      this.valueArray.push(log.patient_stat_dia_evening);
    }
    if (log.patient_stat_pulse_evening) {
      this.valueArray.push(log.patient_stat_pulse_evening);
    }
  }

  /**
   * Process to create each invidual chart.
   * Process is super create chart to create xy axis => create chart => create grid
   */
  createChart(): void {
    super.createChart();
    this.createCursorFullWidth();
    this.createSecondaryXAxis();
    this.createBloodPressureSeries();
    this.recreateGoalGrid(false);
    this.createPulseSeries();
    this.createMeasurementStatesSeries('ihb');
    this.createMeasurementStatesSeries('body_motion');
    this.createMeasurementStatesSeries('tight_fit');
    if (this.showHospitalVisit) {
      this.createConsultationDateAxis();
      this.createConsultationDateSeries();
    }
  }

  /**
   * recreate goal grid
   * @param separateFromChart params to check whether this function is run separately
   */
  private recreateGoalGrid(separateFromChart: boolean) {
    // if there is old grid remove the grids
    if (
      separateFromChart &&
      this.data &&
      ((this.patient_sys_goal &&
        this.patient_sys_goal > this.yAxisData.gridArray[this.yAxisData.gridArray.length - 1]) ||
        (this.patient_dia_goal && this.patient_dia_goal < this.yAxisData.min))
    ) {
      this.dispose();
      this.boot();
      this.createChart();
    }
    if (this.bloodPressureAxis && this.bloodPressureAxis.axisRanges.values.length > 10) {
      this.bloodPressureAxis.axisRanges.removeIndex(11);
      this.bloodPressureAxis.axisRanges.removeIndex(10);
    }
    if (this.bloodPressureAxis) {
      if (this.patient_sys_goal !== 0 && this.patient_sys_goal !== null) this.createGoalGrid(this.patient_sys_goal);
      if (this.patient_dia_goal !== 0 && this.patient_dia_goal !== null) this.createGoalGrid(this.patient_dia_goal);
    }
  }

  /**
   * Create secondary X axis for blood pressure chart and pulse chart, base on hour insteasd of day
   */
  private createSecondaryXAxis() {
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
    this.contentChart.leftAxesContainer.layout = 'vertical';
    this.contentChart.rightAxesContainer.layout = 'vertical';
    this.yAxisData = calculateBPGraphMinMax(this.maxSys, this.minValue);
    if (this.maxSys > this.yAxisData.gridArray[9]) {
      this.yAxisData = calculateBPGraphMinMaxSecondFormula(this.maxSys, this.minValue);
    }
    // create blood pressure axis
    this.bloodPressureAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.bloodPressureAxis.min = this.yAxisData.min - 3;
    this.bloodPressureAxis.max = this.yAxisData.gridArray[9];
    this.bloodPressureAxis.strictMinMax = true;
    if (this.bloodPressureAxis.tooltip) {
      this.bloodPressureAxis.tooltip.disabled = true;
    }
    this.bloodPressureAxis.height = 280;
    this.bloodPressureAxis.renderer.labels.template.disabled = true;
    this.bloodPressureAxis.renderer.width = 110;
    this.bloodPressureAxis.marginLeft = -30;
    this.bloodPressureAxis.renderer.labels.template.fontSize = 12;
    this.bloodPressureAxis.renderer.grid.template.disabled = true;

    this.pulseAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.pulseAxis.min = this.yAxisData.min - 3;
    this.pulseAxis.max = this.yAxisData.gridArray[9];
    this.pulseAxis.renderer.labels.template.disabled = true;
    this.pulseAxis.strictMinMax = true;
    this.pulseAxis.calculateTotals = true;
    if (this.pulseAxis.tooltip) {
      this.pulseAxis.tooltip.disabled = true;
    }
    this.pulseAxis.height = 280;
    if (!this.showHospitalVisit) this.pulseAxis.marginBottom = 103;
    else this.pulseAxis.marginBottom = 143;

    this.pulseAxis.renderer.width = 15;
    this.pulseAxis.renderer.opposite = true;
    this.pulseAxis.renderer.paddingBottom = 100;
    this.pulseAxis.renderer.labels.template.fontSize = 12;
    this.pulseAxis.renderer.grid.template.disabled = true;

    this.yAxisData.gridArray.forEach((value) => {
      this.createAxisLabel(value);
    });

    // create measurement state axis
    this.measurementStateAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.measurementStateAxis.renderer.labels.template.fill = this.labelColor;
    this.measurementStateAxis.min = 0;
    this.measurementStateAxis.max = 4;
    this.measurementStateAxis.renderer.labels.template.disabled = true;
    this.measurementStateAxis.strictMinMax = true;
    if (this.measurementStateAxis.tooltip) {
      this.measurementStateAxis.tooltip.disabled = true;
    }
    this.measurementStateAxis.height = 103;
    this.measurementStateAxis.renderer.width = 110;
    this.measurementStateAxis.marginLeft = -30;
    this.measurementStateAxis.renderer.labels.template.fontSize = 12;
    this.measurementStateAxis.renderer.grid.template.disabled = true;
    const range1 = this.measurementStateAxis.axisRanges.create();
    range1.value = 3;
    range1.grid.opacity = 0;
    range1.label.text = this.translate.instant('irregular');
    range1.label.fill = this.labelColor;
    range1.label.paddingLeft = -16;

    const range2 = this.measurementStateAxis.axisRanges.create();
    range2.value = 2;
    range2.grid.opacity = 0;
    range2.label.text = this.translate.instant('measurement status');
    range2.label.fill = this.labelColor;
    range2.label.paddingLeft = -16;
  }

  /**
   * create axis for consultation date
   */
  createConsultationDateAxis() {
    this.consultationDateAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.consultationDateAxis.renderer.labels.template.fill = this.labelColor;
    this.consultationDateAxis.min = 0;
    this.consultationDateAxis.max = 2;
    this.consultationDateAxis.renderer.labels.template.disabled = true;
    this.consultationDateAxis.strictMinMax = true;
    if (this.consultationDateAxis.tooltip) {
      this.consultationDateAxis.tooltip.disabled = true;
    }
    this.consultationDateAxis.height = 40;
    this.consultationDateAxis.renderer.width = 110;
    this.consultationDateAxis.marginLeft = -30;
    this.consultationDateAxis.renderer.labels.template.fontSize = 12;
    this.consultationDateAxis.renderer.grid.template.disabled = true;
    const range4 = this.consultationDateAxis.axisRanges.create();
    range4.value = 1;
    range4.grid.opacity = 0;
    range4.label.text = this.translate.instant('consultation');
    range4.label.fill = this.labelColor;
  }

  /**
   * Create blood pressure series
   *
   */
  createBloodPressureSeries() {
    const columnSeries = this.contentChart.series.push(new am4charts.ColumnSeries());
    columnSeries.yAxis = this.bloodPressureAxis;
    columnSeries.xAxis = this.secondaryXAxis;
    columnSeries.dataFields.dateX = 'date';
    columnSeries.dataFields.openValueY = 'dia';
    columnSeries.dataFields.valueY = 'sys';
    columnSeries.columns.template.propertyFields.fill = 'color';
    columnSeries.columns.template.propertyFields.stroke = 'color';
    columnSeries.columns.template.width = am4core.percent(600);
  }

  /**
   * create pulse series
   */
  createPulseSeries() {
    const pulseSeries = this.contentChart.series.push(new am4charts.LineSeries());
    pulseSeries.yAxis = this.pulseAxis;
    pulseSeries.xAxis = this.secondaryXAxis;
    pulseSeries.dataFields.dateX = 'date';
    pulseSeries.dataFields.valueY = 'pulse';
    pulseSeries.stroke = am4core.color('#B2B2B2');

    // add circle bullet for each data
    const bullet = pulseSeries.bullets.push(new am4charts.Bullet());
    const bulletCircle = bullet.createChild(am4core.Circle);
    bulletCircle.radius = 4;
    bulletCircle.propertyFields.fill = 'color';
    bulletCircle.stroke = am4core.color('white');
  }

  /**
   * create measurement state series
   * @param state measurement state, value is 'ihb', 'body_motion' and 'tight_fit'
   */
  createMeasurementStatesSeries(state: string) {
    const imageSeries = this.contentChart.series.push(new am4charts.LineSeries());
    imageSeries.yAxis = this.measurementStateAxis;
    imageSeries.dataFields.dateX = 'date';
    if (state == 'ihb') imageSeries.dataFields.valueY = 'value1';
    if (state == 'body_motion') imageSeries.dataFields.valueY = 'value2';
    if (state == 'tight_fit') imageSeries.dataFields.valueY = 'value3';
    imageSeries.strokeWidth = 0;

    const bullet = imageSeries.bullets.push(new am4charts.Bullet());
    let image = bullet.createChild(am4core.Image);
    image.width = 20;
    image.height = 20;
    image.horizontalCenter = 'middle';
    image.verticalCenter = 'middle';
    image.adapter.add('href', (href: any, target: any) => {
      href = '';
      if (target.dataItem) {
        const d: any = this.contentChart.data.find((dat: any) => {
          return dat.date === target.dataItem.dateX;
        });
        if (state == 'ihb') {
          if (d.ihb) href = './assets/images/icon_heart.svg';
        }
        if (state == 'body_motion') {
          if (d.body_motion) href = './assets/images/icon_body.svg';
        }
        if (state == 'tight_fit') {
          if (d.tight_fit === 0) href = './assets/images/cuff_winding.svg';
        }
      }
      return href;
    });
  }

  /**
   * Create consultation series
   */
  createConsultationDateSeries() {
    const imageSeries = this.contentChart.series.push(new am4charts.LineSeries());
    imageSeries.yAxis = this.consultationDateAxis;
    imageSeries.dataFields.dateX = 'date';
    imageSeries.dataFields.valueY = 'value_office';
    imageSeries.strokeWidth = 0;

    const bullet = imageSeries.bullets.push(new am4charts.Bullet());
    let image = bullet.createChild(am4core.Image);
    image.width = 20;
    image.height = 20;
    image.horizontalCenter = 'middle';
    image.verticalCenter = 'middle';
    image.adapter.add('href', (href: any, target: any) => {
      href = '';
      if (target.dataItem) {
        const d: any = this.contentChart.data.find((dat: any) => {
          return dat.date === target.dataItem.dateX;
        });
        if (d.value_office == 1) {
          href = './assets/images/icon_consultation_1.svg';
        }
      }
      return href;
    });
  }

  /**
   * Create goal grid for Y axis
   * @param value the required customized value
   */
  public createGoalGrid(value: number): void {
    const range = this.bloodPressureAxis.axisRanges.create();
    range.value = value;
    range.grid.stroke = am4core.color('#FF7474');
    // range.grid.opacity = 1;
    range.label.text = '{value}';
    range.label.fill = am4core.color('#FF7474');
    range.grid.strokeOpacity = 1;
  }

  /**
   * create label for y axis of blood pressure chart
   * @param value label value
   */
  private createAxisLabel(value: number): void {
    const range1 = this.bloodPressureAxis.axisRanges.create();
    range1.value = value;
    range1.label.text = '{value}';
    range1.label.fill = this.labelColor;
    // create a line at the bottom of the chart
    if (value == this.yAxisData.min) range1.grid.opacity = 1;
    else range1.grid.opacity = 0;

    const range2 = this.pulseAxis.axisRanges.create();
    range2.value = value;
    range2.grid.opacity = 0;
    range2.label.text = '{value}';
    range2.label.fill = this.labelColor;
  }

  /**
   * Set up cursor behavior for the chart
   */
  createCursorFullWidth(): void {
    super.createCursorFullWidth();
    this.contentChart.cursor.clickable = true;
    this.contentChart.cursor.events.on('cursorpositionchanged', (ev: any) => {
      var xAxis = ev.target.chart.xAxes.getIndex(0);
      var yAxis = ev.target.chart.yAxes.getIndex(0);
      this.cursorPosition.x = xAxis.positionToDate(xAxis.toAxisPosition(ev.target.xPosition));
      this.cursorPosition.y = yAxis.positionToValue(yAxis.toAxisPosition(ev.target.yPosition));
      this.cursorPosition.position = ev.target.xPosition;
    });

    this.contentChart.plotContainer.events.on('hit', () => {
      this.openDailyModal(this.cursorPosition);
    });
  }
}
