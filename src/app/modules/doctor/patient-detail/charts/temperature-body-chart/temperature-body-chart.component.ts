import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseChart } from '../base-chart';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { fixNumber } from '@shared/helpers';
import { ValueAxisDataItem } from '@amcharts/amcharts4/charts';

@Component({
  selector: 'app-temperature-body-chart',
  templateUrl: './temperature-body-chart.component.html',
  styleUrls: ['./temperature-body-chart.component.scss'],
})
export class TemperatureBodyChartComponent implements OnInit, OnChanges {
  @Input() startDate: string | Date = new Date();
  @Input() endDate: string | Date = new Date();
  @Input() patient: any;

  @Output() openTemperatureHistory: EventEmitter<any> = new EventEmitter<any>();
  showChart = true;
  temperatureChart: BaseChart | any;
  constructor(private translateService: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if the period changes reboot the whole chart
    // create chart when new data arrive
    if (changes.patient && this.temperatureChart && this.patient) {
      this.temperatureChart.data = this.patient;
      this.loadChart();
      this.temperatureChart.createChart();
    }
  }

  ngOnInit(): void {
    this.temperatureChart = new TemperatureChart(
      this.startDate,
      this.endDate,
      'temperature-body-chart',
      this.translateService
    );
  }

  /**
   * load chart by disposing old chart and create new chart
   */
  loadChart() {
    if (this.temperatureChart) {
      this.temperatureChart.dispose();
      this.temperatureChart.startDate = this.startDate;
      this.temperatureChart.endDate = this.endDate;
      this.temperatureChart.boot();
    }
  }

  /**
   * function when toggle show hide button
   */
  toggleChart() {
    this.showChart = !this.showChart;
    if (this.showChart) {
      this.temperatureChart.contentChart.show();
    } else {
      this.temperatureChart.contentChart.hide();
    }
  }
}

export class TemperatureChart extends BaseChart {
  temperatureAxis: am4charts.Axis | any;

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
      dataInDay.user_stat_temperature_body = fixNumber(dataInDay.user_stat_temperature_body, 2);
      const value = {
        date: new Date(dataInDay.user_stat_ldate),
        temperature: dataInDay.user_stat_temperature_body,
        color: am4core.color('#003153'),
      };
      if (value.temperature) {
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
    this.createTemperatureSeries();
  }

  /**
   * Set up cursor behavior for the chart
   */
  createCursor(): void {
    super.createCursor();
    if (!this.contentChart.data.length) {
      this.contentChart.cursor.lineX.strokeWidth = 0;
    }
  }

  /**
   * get max y axis value follow max temperature count
   * @param maxTemperature - max temperature count in all data of chart
   * @param minTemperature - min temperature count in all data of chart
   */
  getMaxYAxis(maxTemperature: number, minTemperature: number): number[] {
    let temperature = ((maxTemperature - minTemperature) * 4) / 3;
    let exp = Math.floor(Math.log10(temperature));
    let multiples = Math.pow(10, exp - 1);
    let step = 0;
    if (temperature < multiples * 20) step = multiples * 5;
    else if (temperature < multiples * 40) step = multiples * 10;
    else if (temperature < multiples * 80) step = multiples * 20;
    else step = multiples * 50;
    const residuals = minTemperature % step;
    let min = minTemperature - (residuals ? residuals : step);
    min = temperature < step * 2 && min + step > minTemperature ? min - step : min;

    return [min, min + step * 4];
  }

  /**
   * Create Y axis for this chart
   */
  createYAxis() {
    const temperatureList: Array<number> = [];
    Object.values(this.data).map((dataInDay: any) => {
      if (dataInDay.user_stat_temperature_body) {
        temperatureList.push(dataInDay.user_stat_temperature_body);
      }
    });
    const maxTemperature = Math.floor(temperatureList.length > 0 ? Math.max(...temperatureList) : 44) + 1;
    let minTemperature = Math.floor(temperatureList.length > 0 ? Math.min(...temperatureList) : 35);

    // create blood pressure axis
    this.temperatureAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    const range = this.getMaxYAxis(maxTemperature, minTemperature);
    this.temperatureAxis.min = range[0];
    this.temperatureAxis.max = range[1];
    this.temperatureAxis.strictMinMax = true;
    this.temperatureAxis.calculateTotals = true;
    if (this.temperatureAxis.tooltip) {
      this.temperatureAxis.tooltip.disabled = true;
    }

    this.temperatureAxis.renderer.minGridDistance = 16;
    this.temperatureAxis.renderer.labels.template.fill = am4core.color('#7F7F7F');
    this.temperatureAxis.renderer.minWidth = 35;
    this.temperatureAxis.renderer.labels.template.fontSize = 12;
    this.temperatureAxis.renderer.grid.template.strokeDasharray = '4';
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
   * Create body temperature series
   *
   */
  createTemperatureSeries() {
    const series = this.contentChart.series.push(new am4charts.LineSeries());
    series.yAxis = this.temperatureAxis;
    series.dataFields.dateX = 'date';
    series.dataFields.valueY = 'temperature';
    series.stroke = am4core.color('#B2B2B2');

    // add circle bullet for each data
    const bullet = series.bullets.push(new am4charts.Bullet());
    const bulletCircle = bullet.createChild(am4core.Circle);
    bulletCircle.radius = 3;
    bulletCircle.propertyFields.fill = 'color';
    bulletCircle.propertyFields.stroke = 'color';
    bullet.tooltipText = '{temperature}°C';
    if (series.tooltip) {
      this.setTooltipProperty(series.tooltip);
    }
  }

  // change tooltip property comparing to base function
  setTooltipProperty(tooltip: am4core.Tooltip): void {
    super.setTooltipProperty(tooltip);
    tooltip.dy = -5;
    tooltip.label.minWidth = 96;
    tooltip.label.textAlign = 'middle';
  }
}
