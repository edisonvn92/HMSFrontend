import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@env/environment';
import * as moment from 'moment';
import { ValueAxisDataItem } from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { monthNames } from '@shared/helpers/data';

export class BaseChart {
  public chartContainer: am4core.Container | any;
  public containerId: string = '';
  public contentChart: am4charts.XYChart | any;
  public data: any;
  public startDate: string | Date = new Date(moment().startOf('month').toString());
  public endDate: string | Date = new Date();
  public translate: TranslateService;
  public dateAxis: am4charts.Axis | any;
  public yAxis: am4charts.Axis | any;
  public labelFontSize = 12;
  public labelFill = '#7f7f7f';
  public strokeColor = '#B2B2B2';
  public day = 24 * 3600 * 1000;

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
    this.createChartContainer();
    this.boot();
  }

  /**
   * Process to create each invidual chart.
   * Process is createContentChart => load data => create Date Axis => create Y axis => create series
   */
  createChart(): void {
    this.contentChart.data = this.loadData();
    this.contentChart.focusFilter.stroke = am4core.color('#fff');
    this.contentChart.focusFilter.strokeWidth = 0;

    // set up x axis (date axis)
    this.createDateAxis();
    this.createYAxis();
  }

  /**
   * create chart container
   */
  createChartContainer(): void {
    am4core.useTheme(am4themes_animated);
    this.chartContainer = am4core.create(this.containerId, am4core.Container);
    this.chartContainer.width = am4core.percent(100);
    this.chartContainer.height = am4core.percent(100);
    this.chartContainer.resizable = true;
    this.chartContainer.padding = 0;
    this.chartContainer.margin = 0;
    this.chartContainer.layout = 'vertical';
    this.chartContainer.togglable = true;
    this.chartContainer.tapToActivate = true;
    this.chartContainer.resizable = false;
  }

  /**
   * base to create X axis for this chart
   */
  createDateAxis() {
    this.contentChart.bottomAxesContainer.layout = 'vertical';
    this.dateAxis = this.contentChart.xAxes.push(new am4charts.DateAxis());
    this.dateAxis.min = new Date(this.startDate).getTime();
    this.dateAxis.max = new Date(this.endDate).getTime();
    this.dateAxis.dateFormats.setKey('day', 'd');
    this.dateAxis.periodChangeDateFormats.setKey('day', 'd');
    this.dateAxis.renderer.grid.template.location = 0;
    this.dateAxis.baseInterval = {
      timeUnit: 'day',
      count: 1,
    };
    this.dateAxis.gridIntervals.setAll([{ timeUnit: 'day', count: 1 }]);
    this.dateAxis.renderer.cellStartLocation = 0;
    this.dateAxis.renderer.cellEndLocation = 1;
    this.dateAxis.renderer.grid.template.disabled = true;
    this.dateAxis.renderer.labels.template.dy = 15;
    this.dateAxis.renderer.labels.template.fontSize = 12;
    this.dateAxis.renderer.labels.template.fill = am4core.color('#000000D9');
    this.dateAxis.cursorTooltipEnabled = false;
    // create month label for X axis
    this.createMonthLabel();

    return this.dateAxis;
  }

  /**
   * base to create Y axis for this chart
   */
  createYAxis() {}

  /**
   * create label for y axis  chart
   * @param value label value
   */
  createAxisLabel(value: number): void {}

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
   * Create a chart inside the container
   */
  createContentChart(): void {
    this.contentChart = this.chartContainer.createChild(am4charts.XYChart);
    this.contentChart.chartContainer.toBack();
    this.contentChart.height = am4core.percent(100);
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
    range.grid.stroke = am4core.color(option?.color || this.strokeColor);
    range.grid.strokeOpacity = option.opacity !== undefined ? option?.opacity : 1;
    range.grid.strokeWidth = option.strokeWidth !== undefined ? option.strokeWidth : 0.4;
    range.label.fill = option.labelFill !== undefined ? am4core.color(option.labelFill) : am4core.color(this.labelFill);
    range.label.text = option.hiddenLabel ? '' : '{value}';
    range.label.fontSize = this.labelFontSize;
    if (option.strokeDasharray) {
      range.grid.strokeDasharray = option.strokeDasharray;
    }
    return range;
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
   * What to run when the chart is created: load data, create label, create container, create chart.
   * The order may change according to individual chart (some chart may need more icons, etc)
   */
  boot(): void {
    this.createContentChart();
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

          this.translate.get('month').subscribe((month: string) => {
            monthRange.label.text =
              this.translate.currentLang !== 'en_US' ? monthNumber + month : monthNames[monthStart.getMonth()];
          });
          monthRange.label.dy = -5;
          monthRange.label.location = 0.5;
          monthRange.label.fontSize = this.labelFontSize;
          current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
        }
      });
    }
  }

  /**
   * Set the general property for the tooltip
   * @param tooltip the tooltip using the set of properties
   */
  setTooltipProperty(tooltip: am4core.Tooltip | any): void {
    tooltip.pointerOrientation = 'down';
    tooltip.getFillFromObject = false;
    tooltip.background.cornerRadius = 12;
    tooltip.label.padding(0, 0, 0, 0);
    tooltip.background.fillOpacity = 1;
    tooltip.background.stroke = am4core.color('#FFFFFF');
    tooltip.background.strokeOpacity = 0.9;
    tooltip.background.fill = am4core.color('#FFFFFF');
    tooltip.label.fillOpacity = 1;
    tooltip.ignoreBounds = false;
    tooltip.background.filters.clear();
    tooltip.label.fontSize = 14;
  }
}
