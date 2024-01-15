import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { BaseChart } from '../base-chart';
import { calculateBPGraphMinMax, calculateBPGraphMinMaxSecondFormula } from '@shared/helpers';
import { defaultMinMaxBP, fullDayOfWeek, monthNames } from '@shared/helpers/data';
import moment from 'moment';

export class BloodPressureChart extends BaseChart {
  public patient_sys_goal: number = 0;
  public patient_dia_goal: number = 0;
  public BPAxis: am4charts.Axis | any;
  public minValue: number = defaultMinMaxBP.max;
  public maxSys: number = defaultMinMaxBP.min;
  public valueArray: number[] = [];
  public sysArray: number[] = [];
  public BPAxisData = {
    min: 0,
    max: 0,
    gridArray: [] as number[],
  };

  /**
   * Process to create each invidual chart.
   * Process is super create chart to create xy axis => create chart => create grid
   */
  public createChart(): void {
    super.createChart();
    this.createBloodPressureSeries();
    this.createPulseSeries();
    this.createCategoryAxis();
  }

  /**
   * organize data to prepare for chart
   * @returns organized data
   */
  public loadData(): any[] {
    let modifiedData: any[] = [];

    let currentDate = new Date(this.startDate);
    while (currentDate < new Date(this.endDate)) {
      modifiedData.push({
        date_category: currentDate.getTime(),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const dataArray = Object.keys(this.data) as string[];
    dataArray
      .sort((log1: any, log2: any) => {
        let date1 = moment(log1).toDate();
        let date2 = moment(log2).toDate();
        return date1.getTime() - date2.getTime();
      })
      .forEach((key: any) => {
        const dataInDay = this.data[key];

        this.addToValueArray(dataInDay);

        if (
          dataInDay.patient_stat_sys_morning ||
          dataInDay.patient_stat_dia_morning ||
          dataInDay.patient_stat_pulse_morning
        ) {
          modifiedData.push({
            date: moment(`${key} ${dataInDay.vital_office_utc_time ? '04:00:00' : '08:00:00'}`).toDate(),
            sys: dataInDay.patient_stat_sys_morning,
            dia: dataInDay.patient_stat_dia_morning,
            pulse: dataInDay.patient_stat_pulse_morning,
            color: '#1890FF',
          });
        }

        modifiedData.push({
          date: moment(`${key} 12:00:00`).toDate(),
          sys: dataInDay.vital_office_systolic,
          dia: dataInDay.vital_office_diastolic,
          pulse: dataInDay.vital_office_pulse,
          color: '#0050B3',
        });

        if (
          dataInDay.patient_stat_sys_evening ||
          dataInDay.patient_stat_dia_evening ||
          dataInDay.patient_stat_pulse_evening
        ) {
          modifiedData.push({
            date: moment(`${key} ${dataInDay.vital_office_utc_time ? '20:00:00' : '16:00:00'}`).toDate(),
            sys: dataInDay.patient_stat_sys_evening,
            dia: dataInDay.patient_stat_dia_evening,
            pulse: dataInDay.patient_stat_pulse_evening,
            color: '#002766',
          });
        }
      });

    if (this.patient_dia_goal && this.patient_dia_goal !== 0) this.valueArray.push(this.patient_dia_goal);
    if (this.patient_sys_goal && this.patient_sys_goal !== 0) this.sysArray.push(this.patient_sys_goal);
    if (this.sysArray.length) this.maxSys = Math.max(...this.sysArray);
    else this.maxSys = defaultMinMaxBP.max;
    if (this.valueArray.length) this.minValue = Math.min(...this.valueArray);
    else this.minValue = defaultMinMaxBP.min;
    return modifiedData;
  }

  /**
   * Create Date Axis for the chart.
   * Including Month label for date axis.
   * Add cursor and week grid in individual functions for each chart
   */
  createDateAxis() {
    this.dateAxis = this.contentChart.xAxes.push(new am4charts.DateAxis());
    this.dateAxis.min = new Date(this.startDate).getTime();
    this.dateAxis.max = new Date(this.endDate).getTime();

    this.dateAxis.dateFormats.setKey('day', 'd');
    this.dateAxis.periodChangeDateFormats.setKey('day', 'd');
    this.dateAxis.renderer.grid.template.location = 0;
    this.dateAxis.baseInterval = {
      timeUnit: 'second',
      count: 1,
    };
    this.dateAxis.gridIntervals.setAll([{ timeUnit: 'day', count: 1 }]);
    this.dateAxis.renderer.labels.template.disabled = true;
    this.dateAxis.renderer.cellStartLocation = 0;
    this.dateAxis.renderer.cellEndLocation = 1;
    this.dateAxis.height = 0;
  }

  /**
   * Create goal grid for Y axis
   * @param value the required customized value
   */
  public createGoalGrid(value: number): void {
    const range = this.BPAxis.axisRanges.create();
    range.value = value;
    range.grid.stroke = am4core.color('#FF6F42');
    range.label.text = '{value}';
    range.label.fill = am4core.color('#FF6F42');
    range.grid.strokeOpacity = 1;
  }

  createCategoryAxis() {
    let dateAxis = this.contentChart.xAxes.push(new am4charts.CategoryAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.labels.template.disabled = true;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.dataFields.category = 'date_category';
    dateAxis.renderer.line.strokeOpacity = this.BPAxisData.min === this.patient_dia_goal ? 0 : 1;
    dateAxis.renderer.line.stroke = am4core.color(this.strokeColor);
    dateAxis.renderer.labels.template.dy = 8;
    dateAxis.height = 45;

    this.contentChart.data.forEach((data: any) => {
      if (data.date_category) {
        this.createXLabel(dateAxis, data.date_category, new Date(data.date_category).getDate(), {
          label_fill:
            new Date(data.date_category).getDay() === 6
              ? '#2181F2'
              : new Date(data.date_category).getDay()
              ? am4core.color('#595959')
              : '#FF6F42',
          stroke_width: 0,
        });
      }
    });

    // create month label for X axis
    if (this.dateAxis) {
      this.dateAxis.events.on('datavalidated', (ev: any) => {
        const axis = ev.target;
        const start = axis.positionToDate(0);
        const end = axis.positionToDate(1);
        let current = new Date(start);

        // create month range
        current = new Date(start);
        let nextEnd = new Date(end.getFullYear(), end.getMonth() + 1, 1);
        while (current < nextEnd) {
          // find the month start date to set the label
          let monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
          if (monthStart < start) {
            monthStart = new Date(start);
          }

          // set up the label
          const monthRange = axis.axisRanges.create();
          monthRange.date = monthStart;
          monthRange.endDate = new Date(monthStart.getTime() + 24 * 60 * 60 * 1000);
          monthRange.grid.opacity = 0;
          const monthNumber = monthStart.getMonth() + 1;
          setTimeout(() => {
            this.translate.get('month').subscribe((month: string) => {
              monthRange.label.text =
                this.translate.currentLang !== 'en' ? monthNumber + month : monthNames[monthStart.getMonth()];
            });
          }, 0);

          monthRange.label.dy = -50;
          monthRange.label.location = 0.5;
          monthRange.label.fontSize = this.labelFontSize;
          monthRange.label.fill = am4core.color('#AEAEAE');
          current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
        }
      });
    }
  }

  /**
   * Create Y axis for this chart
   */
  public createYAxis() {
    // create blood pressure axis
    this.BPAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.BPAxisData = calculateBPGraphMinMax(this.maxSys, this.minValue);
    if (this.maxSys > this.BPAxisData.gridArray[9]) {
      this.BPAxisData = calculateBPGraphMinMaxSecondFormula(this.maxSys, this.minValue);
    }

    this.BPAxis.min = this.BPAxisData.min;
    this.BPAxis.max = this.BPAxisData.gridArray[this.BPAxisData.gridArray.length - 1];
    this.BPAxis.strictMinMax = true;
    this.BPAxis.calculateTotals = true;
    if (this.BPAxis.tooltip) {
      this.BPAxis.tooltip.disabled = true;
    }

    this.BPAxis.renderer.grid.template.disabled = true;
    this.BPAxis.renderer.labels.template.disabled = true;
    this.BPAxis.renderer.labels.template.fontSize = this.labelFontSize;
    this.BPAxis.renderer.grid.template.strokeDasharray = '4';

    // create range
    this.BPAxisData.gridArray.forEach((value: number, index: number) => {
      if (![this.patient_sys_goal, this.patient_dia_goal].includes(value)) {
        this.createHorizontalGrid(this.BPAxis, value, { opacity: !!index, labelFill: '#595959' });
      }
    });

    if (this.BPAxisData) {
      if (this.patient_sys_goal) this.createGoalGrid(this.patient_sys_goal);
      if (this.patient_dia_goal) this.createGoalGrid(this.patient_dia_goal);
    }
  }

  /**
   * create label for X Axis
   * @param xAxis x axis
   * @param category category name
   * @param label label text
   * @param option option
   */
  private createXLabel(xAxis: am4charts.CategoryAxis, category: string, label: number, option?: any) {
    const range = xAxis.axisRanges.create();
    const day = new Date(category).getDay();

    range.category = category;
    range.grid.strokeOpacity = 0;
    range.label.dy = 13;
    this.translate.get(`app day text.${fullDayOfWeek[day]}`).subscribe((dayOfWeek: string) => {
      range.label.html = `<div class="webview-day-wrap">
                            <div class="day ${moment().isSame(category, 'day') ? 'current-day' : ''}">${label}</div>
                            <div class="day-of-week ${day !== 0 && day !== 6 ? 'text-gray-450' : ''}">${dayOfWeek}</div>
                          </div>`;
    });
    range.label.fontSize = this.labelFontSize;
    range.label.fill = option?.label_fill ? option.label_fill : am4core.color('#000000d9');
    range.grid.stroke = option?.color ? option?.color : am4core.color(this.strokeColor);
    range.grid.strokeOpacity = option?.opacity !== undefined ? option?.opacity : 1;
    range.grid.strokeWidth = option?.stroke_width !== undefined ? option.stroke_width : 1;
  }

  /**
   * create BP column series
   */
  public createBloodPressureSeries() {
    const columnSeries = this.contentChart.series.push(new am4charts.ColumnSeries());
    columnSeries.yAxis = this.BPAxis;
    columnSeries.xAxis = this.dateAxis;
    columnSeries.dataFields.dateX = 'date';
    columnSeries.dataFields.openValueY = 'dia';
    columnSeries.dataFields.valueY = 'sys';
    columnSeries.columns.template.propertyFields.fill = 'color';
    columnSeries.columns.template.propertyFields.stroke = 'color';
    columnSeries.columns.template.width = am4core.percent(1400000);
    columnSeries.columns.template.column.cornerRadiusTopLeft = am4core.percent(100);
    columnSeries.columns.template.column.cornerRadiusTopRight = am4core.percent(100);
    columnSeries.columns.template.column.cornerRadiusBottomLeft = am4core.percent(100);
    columnSeries.columns.template.column.cornerRadiusBottomRight = am4core.percent(100);

    columnSeries.stacked = true;
  }

  /**
   * create pulse series
   */
  createPulseSeries() {
    const pulseSeries = this.contentChart.series.push(new am4charts.LineSeries());
    pulseSeries.yAxis = this.BPAxis;
    pulseSeries.xAxis = this.dateAxis;
    pulseSeries.dataFields.dateX = 'date';
    pulseSeries.dataFields.valueY = 'pulse';
    pulseSeries.stroke = am4core.color('#1890FF');
    pulseSeries.strokeWidth = 2;

    // add circle bullet for each data
    const bullet = pulseSeries.bullets.push(new am4charts.Bullet());
    const bulletCircle = bullet.createChild(am4core.Circle);
    bulletCircle.radius = 4;
    bullet.strokeWidth = 1.2;
    bulletCircle.propertyFields.fill = 'color';
    bulletCircle.stroke = am4core.color('white');
    bullet.stroke = am4core.color('white');
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
    if (log.patient_stat_pulse_morning) {
      this.valueArray.push(log.patient_stat_pulse_morning);
    }
    if (log.patient_stat_pulse_evening) {
      this.valueArray.push(log.patient_stat_pulse_evening);
    }
  }
}
