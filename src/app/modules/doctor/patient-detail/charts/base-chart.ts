import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { TranslateService } from '@ngx-translate/core';
import { ValueAxisDataItem } from '@amcharts/amcharts4/charts';
import { IHospitalWeightAlertSetting } from '@models/hospital';
import { environment } from '@env/environment';
import { monthNames } from '@shared/helpers/data';
import moment from 'moment';

export class BaseChart {
  labelColor = am4core.color('#7F7F7F');
  public translate: TranslateService;
  public chartContainer: am4core.Container | any;
  public contentChart: am4charts.XYChart | any;
  public data: any;
  public hospitalThresholdAlert: IHospitalWeightAlertSetting | any;
  public startDate: string | Date = new Date();
  public endDate: string | Date = new Date();
  public maxValue: number = 0;
  public containerId: string = '';
  public dateAxis: am4charts.Axis | any;
  public hospitalSetting: any;
  public cellWidth: number = 0;
  /**
   * constructor for all charts in patient details view
   *
   * @param startDate
   * @param endDate
   * @param containerId
   * @param translateService
   */
  constructor(
    startDate: string | Date,
    endDate: string | Date,
    containerId: string,
    translateService: TranslateService
  ) {
    am4core.addLicense(environment.amchart_license_code);
    this.endDate = endDate;
    this.startDate = startDate;
    this.containerId = containerId;
    this.translate = translateService;
    am4core.options.autoSetClassName = true;
    am4core.options.autoDispose = true;
    this.createChartContainer(this.containerId);
    this.boot();
  }

  /**
   * Create container for chart
   * @param containerId id of the container div
   */
  createChartContainer(containerId: string) {
    am4core.useTheme(am4themes_animated);
    this.chartContainer = am4core.create(containerId, am4core.Container);
    this.chartContainer.width = am4core.percent(100);
    this.chartContainer.height = am4core.percent(100);
    this.chartContainer.resizable = true;
    this.chartContainer.padding = 0;
    this.chartContainer.margin = 0;
    this.chartContainer.layout = 'vertical';
    this.chartContainer.togglable = true;
  }

  /**
   * What to run when the chart is created: load data, create label, create container, create chart.
   * The order may change according to individual chart (some chart may need more icons, etc)
   */
  boot(): void {
    this.createContentChart();
    this.contentChart.chartContainer.toBack();
  }
  /**
   * Process to create each invidual chart.
   * Process is createContentChart => load data => create Date Axis => create Y axis => create series
   */
  createChart(): void {
    this.contentChart.data = this.loadData();
    // set up x axis (date axis)
    this.createDateAxis();
    this.createYAxis();
  }

  loadData(): any[] {
    return [];
  }

  /**
   * destroy the chart (when the data change and a new chart is needed, or move to other pages)
   */
  dispose(): void {
    if (this.contentChart) {
      this.contentChart.dispose();
      this.contentChart = null;
    }
  }

  /**
   * Create a chart inside the container
   */
  createContentChart(): void {
    this.contentChart = this.chartContainer.createChild(am4charts.XYChart);
  }

  /**
   * Create Date Axis for the chart.
   * Including Month label for date axis.
   * Add cursor and week grid in individual functions for each chart
   */
  createDateAxis(): void {
    this.dateAxis = this.contentChart.xAxes.push(new am4charts.DateAxis());
    this.dateAxis.min = moment(this.startDate + ' 00:00:00')
      .toDate()
      .getTime();
    this.dateAxis.max = moment(this.endDate + ' 23:59:59')
      .toDate()
      .getTime();
    this.dateAxis.dateFormats.setKey('day', 'd');
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
    this.dateAxis.renderer.labels.template.dy = 15;
    this.dateAxis.renderer.labels.template.fontSize = 12;
    this.dateAxis.renderer.labels.template.fill = am4core.color('#000000D9');
    this.dateAxis.cursorTooltipEnabled = false;
    // create month label for X axis
    this.createMonthLabel();
    this.createWeekRange();
    this.dateAxis.events.on('sizechanged', (ev: any) => {
      let axis = ev.target;
      this.cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex - 2);
    });
    return this.dateAxis;
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
          weekRange.grid.stroke = am4core.color('#E5E5E5');
          current.setDate(current.getDate() + 6);
        }
      });
    }
  }

  /**
   * Create month label on the dateAxis
   */
  createMonthLabel(): void {
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
          monthRange.label.text =
            this.translate.currentLang === 'ja'
              ? monthNumber + this.translate.instant('month')
              : monthNames[monthStart.getMonth()];
          monthRange.label.dy = -5;
          monthRange.label.location = 0.5;
          monthRange.label.fontSize = 12;
          current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
        }
      });
    }
  }

  /**
   * Set up cursor behavior for the chart
   */
  createCursor(): void {
    this.contentChart.cursor = new am4charts.XYCursor();
    this.contentChart.cursor.behavior = 'none';
    this.contentChart.cursor.xAxis = this.dateAxis;
    this.contentChart.cursor.lineX.strokeDasharray = '';
    this.contentChart.cursor.lineX.strokeWidth = 1;
    this.contentChart.cursor.lineY.opacity = 0;
    if (this.contentChart.cursor.tooltip) {
      this.contentChart.cursor.tooltip.disabled = true;
    }
  }

  /**
   * Template to create y axis
   */
  createYAxis(): any {}
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
   * Set the general property for the tooltip
   * @param tooltip the tooltip using the set of properties
   */
  setTooltipProperty(tooltip: am4core.Tooltip | any): void {
    tooltip.pointerOrientation = 'down';
    tooltip.getFillFromObject = false;
    tooltip.background.cornerRadius = 4;
    tooltip.background.fillOpacity = 0.9;
    tooltip.background.stroke = am4core.color('#2E303A');
    tooltip.background.strokeOpacity = 0.9;
    tooltip.background.fill = am4core.color('#2E303A');
    tooltip.label.fillOpacity = 0.9;
    tooltip.ignoreBounds = false;
    tooltip.background.filters.clear();
    tooltip.label.fontSize = 14;
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
    range.grid.stroke = am4core.color(option?.color || '#B2B2B2');
    range.grid.strokeOpacity = option.opacity !== undefined ? option?.opacity : 1;
    range.grid.strokeWidth = option.strokeWidth !== undefined ? option.strokeWidth : 1;
    range.label.fill = option.labelFill !== undefined ? am4core.color(option.labelFill) : am4core.color('#7f7f7f');
    range.label.text = '{value}';
    range.label.fontSize = 12;
    if (option.strokeDasharray) {
      range.grid.strokeDasharray = option.strokeDasharray;
    }
    return range;
  }

  /**
   * create cursor full width
   */
  createCursorFullWidth(): void {
    this.contentChart.cursor = new am4charts.XYCursor();
    this.contentChart.cursor.behavior = 'none';
    this.contentChart.cursor.xAxis = this.dateAxis;
    this.contentChart.cursor.fullWidthLineX = true;
    this.contentChart.cursor.lineX.strokeWidth = 0;
    this.contentChart.cursor.lineY.opacity = 0;
    this.contentChart.cursor.lineX.fill = am4core.color('#5397EA');
    this.contentChart.cursor.lineX.fillOpacity = 0.3;
    if (!this.contentChart.data.length) {
      this.contentChart.cursor.fullWidthLineX = false;
    }
    if (this.contentChart.cursor.tooltip) {
      this.contentChart.cursor.tooltip.disabled = true;
    }
  }
}
