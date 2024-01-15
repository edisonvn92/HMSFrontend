import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseChart } from '../base-chart';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { TranslateService } from '@ngx-translate/core';
import { fixNumber, floorNumber, getPluralNoun, getWeightChartYRange } from '@shared/helpers';
import { ValueAxisDataItem } from '@amcharts/amcharts4/charts';
import { IAlertWeight } from '@models/alert';

@Component({
  selector: 'app-body-weight-chart',
  templateUrl: './body-weight-chart.component.html',
  styleUrls: ['./body-weight-chart.component.scss'],
})
export class BodyWeightChartComponent implements OnInit, OnChanges {
  @Input() startDate: string | Date = new Date();
  @Input() endDate: string | Date = new Date();
  @Input() patient: any;
  @Input() hospitalSetting: any;
  @Output() openBodyWeightHistory: EventEmitter<any> = new EventEmitter<any>();

  bodyWeightChart: BaseChart | any;
  showChart = true;

  constructor(private translateService: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if the period changes reboot the whole chart
    // create chart when new data arrive
    if (changes.patient && this.bodyWeightChart && this.patient) {
      this.bodyWeightChart.data = this.patient;
      this.loadChart();
    }
  }

  ngOnInit(): void {
    this.bodyWeightChart = new BodyWeightChart(
      this.startDate,
      this.endDate,
      'body-weight-chart',
      this.translateService
    );
    this.bodyWeightChart.hospitalSetting = this.hospitalSetting;
  }

  /**
   * load chart by disposing old chart and create new chart
   */
  loadChart() {
    if (this.bodyWeightChart) {
      this.bodyWeightChart.dispose();
      this.bodyWeightChart.startDate = this.startDate;
      this.bodyWeightChart.endDate = this.endDate;
      this.bodyWeightChart.boot();
      this.bodyWeightChart.createChart();
    }
  }

  /**
   * function when toggle show hide button
   */
  toggleChart() {
    this.showChart = !this.showChart;
    if (this.showChart) {
      this.bodyWeightChart.contentChart.show();
    } else {
      this.bodyWeightChart.contentChart.hide();
    }
  }
}

export class BodyWeightChart extends BaseChart {
  bodyWeightAxis: am4charts.Axis | any;

  createChartContainer(containerId: string) {
    super.createChartContainer(containerId);
  }

  /**
   * handle tooltip follow alert
   *
   * @param alertWeights
   * @param weight - weight of the day being considered
   */
  getTooltipHTML(alertWeights: any, weight: string): string {
    const spaceFollowLang = this.translate.currentLang === 'ja' ? '' : ' ';
    let htmlString = `<div>${weight} kg</div>`;
    if (this.hospitalSetting?.hospital_setting_functions?.ALERT?.WEIGHT?.hospital_setting_function_status) {
      (Object.values(alertWeights) as Array<IAlertWeight>).forEach((value: IAlertWeight) => {
        htmlString = `${htmlString}
                <div class="text-lowercase">${value.alert_weight_ratio > 0 ? '+' : ''}${fixNumber(
          value.alert_weight_ratio
        )} kg / ${value.alert_weight_days}${spaceFollowLang}${this.getPluralNoun(
          'day',
          'days',
          value.alert_weight_days,
          'days'
        )}</div>`;
      });
    }

    return `<div style="min-width: 96px;">${htmlString}</div>`;
  }

  /**
   * organize data to prepare for chart
   * @returns organized data
   */
  loadData(): any[] {
    let modifiedData: any[] = [];
    const keys = Object.keys(this.data).length
      ? Object.keys(this.data).sort((a: string, b: string) => {
          return a > b ? 1 : -1;
        })
      : [];
    keys.map((key: string) => {
      const dataInDay = this.data[key];
      dataInDay.user_stat_ldate = dataInDay?.user_stat_ldate || key;
      dataInDay.user_stat_weight = Number(fixNumber(dataInDay?.user_stat_weight || 0));
      const weight = fixNumber(dataInDay.user_stat_weight);
      const value = {
        date: new Date(dataInDay.user_stat_ldate),
        weight,
        color:
          dataInDay.alert_weights &&
          Object.keys(dataInDay.alert_weights).length > 0 &&
          this.hospitalSetting?.hospital_setting_functions?.ALERT?.WEIGHT?.hospital_setting_function_status
            ? am4core.color('#FF7474')
            : am4core.color('#003153'),
        tooltip: weight ? this.getTooltipHTML(dataInDay.alert_weights || [], weight) : '',
      };
      if (dataInDay.user_stat_weight) {
        modifiedData.push(value);
      }
    });
    return modifiedData;
  }

  /**
   * Process to create each individual chart.
   * Process is super create chart to create xy axis => create chart => create grid
   */
  createChart(): void {
    super.createChart();
    this.dateAxis.renderer.line.strokeOpacity = 1;
    this.dateAxis.renderer.line.stroke = am4core.color('#D8D8D8');
    this.createCursor();
    this.createBodyWeightSeries();
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
   * Create Y axis for this chart
   */
  createYAxis() {
    const weightList: Array<number> = [];
    Object.values(this.data).map((dataInDay: any) => {
      if (dataInDay.user_stat_weight) {
        weightList.push(dataInDay.user_stat_weight);
      }
    });
    let maxWeight = 80;
    let minWeight = 0;
    let getMinMaxYAxis = {
      min: minWeight,
      step: 20,
    };
    if (weightList.length > 0) {
      maxWeight = floorNumber(Math.max(...weightList), 4) + 4;
      minWeight = floorNumber(Math.min(...weightList), 4);
      getMinMaxYAxis = getWeightChartYRange(minWeight, maxWeight);
    }
    // create blood pressure axis
    this.bodyWeightAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.bodyWeightAxis.min = getMinMaxYAxis.min;
    this.bodyWeightAxis.max = getMinMaxYAxis.min + getMinMaxYAxis.step * 4;
    this.bodyWeightAxis.strictMinMax = true;
    this.bodyWeightAxis.calculateTotals = true;
    if (this.bodyWeightAxis.tooltip) {
      this.bodyWeightAxis.tooltip.disabled = true;
    }

    this.bodyWeightAxis.renderer.grid.template.disabled = true;
    this.bodyWeightAxis.renderer.labels.template.disabled = true;
    this.bodyWeightAxis.renderer.labels.template.fontSize = 12;
    this.bodyWeightAxis.renderer.grid.template.strokeDasharray = '4';

    Array.from(Array(5).keys()).forEach((number) => {
      const range = this.bodyWeightAxis.axisRanges.create();
      range.value = getMinMaxYAxis.min + getMinMaxYAxis.step * number;
      range.grid.opacity = 0;
      range.label.text = '{value}';
      range.label.fill = this.labelColor;
      this.createHorizontalGrid(this.bodyWeightAxis, getMinMaxYAxis.min + getMinMaxYAxis.step * number);
    });
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
   * Create body weight series
   *
   */
  createBodyWeightSeries() {
    const series = this.contentChart.series.push(new am4charts.LineSeries());
    series.yAxis = this.bodyWeightAxis;
    series.dataFields.dateX = 'date';
    series.dataFields.valueY = 'weight';
    series.stroke = am4core.color('#B2B2B2');

    // add circle bullet for each data
    const bullet = series.bullets.push(new am4charts.Bullet());
    const bulletCircle = bullet.createChild(am4core.Circle);
    bulletCircle.radius = 3;
    bulletCircle.propertyFields.fill = 'color';
    bulletCircle.propertyFields.stroke = 'color';
    bullet.tooltipHTML = '{tooltip}';

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

  /**
   * get text noun in en language
   * @param singularNoun
   * @param pluralNoun
   * @param value
   * @param textJa
   * @returns
   */
  getPluralNoun(singularNoun: string, pluralNoun: string, value: number, textJa: string): string {
    if (this.translate.currentLang === 'ja') return this.translate.instant(textJa);
    return getPluralNoun(this.translate.instant(singularNoun), this.translate.instant(pluralNoun), value);
  }
}
