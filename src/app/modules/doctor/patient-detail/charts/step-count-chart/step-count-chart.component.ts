import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseChart } from '../base-chart';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { fixNumber } from '@shared/helpers';
import { ValueAxisDataItem } from '@amcharts/amcharts4/charts';

@Component({
  selector: 'app-step-count-chart',
  templateUrl: './step-count-chart.component.html',
  styleUrls: ['./step-count-chart.component.scss'],
})
export class StepCountChartComponent implements OnInit, OnChanges {
  @Input() startDate: string | Date = new Date();
  @Input() endDate: string | Date = new Date();
  @Input() patient: any;

  @Output() openStepCountHistory: EventEmitter<any> = new EventEmitter<any>();
  showChart = true;
  stepCountChart: BaseChart | any;
  constructor(private translateService: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if the period changes reboot the whole chart
    // create chart when new data arrive
    if (changes.patient && this.stepCountChart && this.patient) {
      this.stepCountChart.data = this.patient;
      this.loadChart();
      this.stepCountChart.createChart();
    }
  }

  ngOnInit(): void {
    this.stepCountChart = new StepCountChart(this.startDate, this.endDate, 'step-count-chart', this.translateService);
  }

  /**
   * load chart by disposing old chart and create new chart
   */
  loadChart() {
    if (this.stepCountChart) {
      this.stepCountChart.dispose();
      this.stepCountChart.startDate = this.startDate;
      this.stepCountChart.endDate = this.endDate;
      this.stepCountChart.boot();
    }
  }

  /**
   * function when toggle show hide button
   */
  toggleChart() {
    this.showChart = !this.showChart;
    if (this.showChart) {
      this.stepCountChart.contentChart.show();
    } else {
      this.stepCountChart.contentChart.hide();
    }
  }
}

export class StepCountChart extends BaseChart {
  stepCountAxis: am4charts.Axis | any;

  createChartContainer(containerId: string) {
    super.createChartContainer(containerId);
  }

  /**
   * organize data to prepare for chart
   * @returns organized data
   */
  loadData(): any[] {
    let modifiedData: any[] = [];

    Object.values(this.data).map((dataInDay: any) => {
      dataInDay.user_stat_step_count = Number(fixNumber(dataInDay.user_stat_step_count));
      const value = {
        date: new Date(dataInDay.user_stat_ldate),
        stepCount: dataInDay.user_stat_step_count,
        color: am4core.color('#003153'),
      };
      if (value.stepCount) {
        modifiedData.push(value);
      }
    });
    return modifiedData;
  }

  /**
   * Process to create each invidual chart.
   * Process is super create chart to create xy axis => create chart => create grid
   */
  createChart(): void {
    super.createChart();
    this.dateAxis.renderer.line.strokeOpacity = 1;
    this.dateAxis.renderer.line.stroke = am4core.color('#D8D8D8');
    this.createCursor();
    this.createStepCountSeries();
  }

  /**
   * Set up cursor behavior for the chart
   */
  createCursor(): void {
    super.createCursor();
    this.contentChart.cursor.lineX.strokeWidth = 0;
  }

  /**
   * get max y axis value follow max step count
   * @param maxStep - max step count in all data of chart
   */
  getMaxYAxis(maxStep: number): number {
    let step = maxStep * 1.2;
    if (!maxStep) return 100;
    let exp = Math.floor(Math.log10(step));
    if (step <= Math.pow(10, exp - 1) * 10) return Math.pow(10, exp - 1) * 10;
    if (step <= Math.pow(10, exp - 1) * 20) return Math.pow(10, exp - 1) * 20;
    if (step <= Math.pow(10, exp - 1) * 25) return Math.pow(10, exp - 1) * 25;
    if (step <= Math.pow(10, exp - 1) * 40) return Math.pow(10, exp - 1) * 40;
    if (step <= Math.pow(10, exp - 1) * 50) return Math.pow(10, exp - 1) * 50;
    if (step <= Math.pow(10, exp - 1) * 80) return Math.pow(10, exp - 1) * 80;
    return Math.pow(10, exp - 1) * 100;
  }

  /**
   * Create Y axis for this chart
   */
  createYAxis() {
    const stepList: Array<number> = [];
    Object.values(this.data).map((dataInDay: any) => {
      if (dataInDay.user_stat_step_count) {
        stepList.push(dataInDay.user_stat_step_count);
      }
    });
    const maxStepList = stepList.length > 0 ? Math.max(...stepList) : 100;

    // create blood pressure axis
    this.stepCountAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.stepCountAxis.min = 0;

    this.stepCountAxis.max = this.getMaxYAxis(maxStepList);
    this.stepCountAxis.strictMinMax = true;
    this.stepCountAxis.calculateTotals = true;
    if (this.stepCountAxis.tooltip) {
      this.stepCountAxis.tooltip.disabled = true;
    }

    this.stepCountAxis.renderer.minGridDistance = 16;
    this.stepCountAxis.renderer.labels.template.fill = am4core.color('#7F7F7F');
    this.stepCountAxis.renderer.minWidth = 35;
    this.stepCountAxis.renderer.labels.template.fontSize = 12;
    this.stepCountAxis.renderer.grid.template.strokeDasharray = '4';
  }

  /**
   * Create customized label/grid for Y axis
   * @param yAxis Y axis of the chart
   * @param value the required customized value
   */
  public createHorizontalGrid(yAxis: am4charts.ValueAxis, value: number): ValueAxisDataItem {
    const range = yAxis.axisRanges.create();
    range.value = value;
    range.grid.strokeDasharray = '4';
    return range;
  }

  /**
   * Create body stepCount series
   *
   */
  createStepCountSeries() {
    const columnSeries = this.contentChart.series.push(new am4charts.ColumnSeries());
    columnSeries.yAxis = this.stepCountAxis;
    columnSeries.dataFields.dateX = 'date';
    columnSeries.dataFields.valueY = 'stepCount';
    columnSeries.columns.template.propertyFields.fill = 'color';
    columnSeries.columns.template.propertyFields.stroke = 'color';
    columnSeries.columns.template.width = am4core.percent(50);
    columnSeries.columns.template.tooltipPosition = 'fixed';
    columnSeries.columns.template.tooltipY = am4core.percent(0);
    columnSeries.columns.template.tooltipText = '{stepCount}';

    if (columnSeries.tooltip) {
      this.setTooltipProperty(columnSeries.tooltip);
    }
  }

  // change tooltip property comparing to base function
  setTooltipProperty(tooltip: am4core.Tooltip): void {
    super.setTooltipProperty(tooltip);
    tooltip.label.minWidth = 96;
    tooltip.label.textAlign = 'middle';
  }
}
