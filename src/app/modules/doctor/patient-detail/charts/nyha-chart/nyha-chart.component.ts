import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseChart } from '../base-chart';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

@Component({
  selector: 'app-nyha-chart',
  templateUrl: './nyha-chart.component.html',
  styleUrls: ['./nyha-chart.component.scss'],
})
export class NYHAChartComponent implements OnInit, OnChanges {
  @Input() startDate: string | Date = new Date();
  @Input() endDate: string | Date = new Date();
  @Input() patient: any;

  showChart = true;
  nyhaChart: BaseChart | any;

  constructor(private translateService: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if the period changes reboot the whole chart
    // create chart when new data arrive
    if (changes.patient && this.nyhaChart && this.patient) {
      this.nyhaChart.data = this.patient;
      this.loadChart();
      this.nyhaChart.createChart();
    }
  }

  ngOnInit(): void {
    this.nyhaChart = new NYHAChart(this.startDate, this.endDate, 'nyha-chart', this.translateService);
  }

  /**
   * load chart by disposing old chart and create new chart
   */
  loadChart() {
    if (this.nyhaChart) {
      this.nyhaChart.dispose();
      this.nyhaChart.startDate = this.startDate;
      this.nyhaChart.endDate = this.endDate;
      this.nyhaChart.boot();
    }
  }
}

export class NYHAChart extends BaseChart {
  valueAxis: am4charts.Axis | any;
  XValue = [
    { text: 'I', value: 1, color: '#64B4D8' },
    { text: 'II', value: 2, color: '#F7D546' },
    { text: 'III', value: 3, color: '#FF8A33' },
    { text: 'IV', value: 4, color: '#DF2F2F' },
  ];

  createChartContainer(containerId: string) {
    super.createChartContainer(containerId);
  }

  /**
   * organize data to prepare for chart
   * @returns organized data
   */
  loadData(): any[] {
    let modifiedData: any[] = [];
    let preMets!: number | string;
    let preDate!: Date;

    Object.values(this.data).map((dataInDay: any) => {
      const patient_review_mets = this.getMetsValue(dataInDay.patient_review_mets);
      if (patient_review_mets) {
        const value: any = {
          date: new Date(dataInDay.patient_review_ldate),
          mets: patient_review_mets,
          color: this.XValue[patient_review_mets - 1].color,
          startDate: new Date(dataInDay.patient_review_ldate).getTime() - 24 * 3600 * 1000,
        };
        if (preMets && value.mets && preMets !== value.mets) {
          value.riserStart = preMets > value.mets ? value.mets : preMets;
          value.riserEnd = preMets < value.mets ? value.mets : preMets;
        }

        if (value.date) {
          modifiedData.push(value);
        }

        // set line default between two record
        while (preDate && preDate.getTime() < value.startDate) {
          preDate = new Date(preDate.getTime() + 24 * 3600 * 1000);
          const dateData = {
            date: preDate,
            lineValue: preMets,
          };

          if (dateData.date) {
            modifiedData.push(dateData);
          }
        }

        preMets = value.mets;
        preDate = value.date;
      }
    });

    // set line default before date has record
    let startDate = new Date(this.startDate);
    while (modifiedData[0] && startDate.getTime() < modifiedData[0].date.getTime()) {
      const dateData = {
        date: startDate,
        lineValue: modifiedData[0].mets,
      };

      if (dateData.date) {
        modifiedData.push(dateData);
      }

      startDate = new Date(startDate.getTime() + 24 * 3600 * 1000);
    }

    // set line default after date has record
    while (preDate && preDate.getTime() < new Date(this.endDate).getTime()) {
      preDate = new Date(preDate.getTime() + 24 * 3600 * 1000);
      const dateData = {
        date: preDate,
        lineValue: preMets,
      };

      if (dateData.date) {
        modifiedData.push(dateData);
      }
    }
    return modifiedData;
  }

  /**
   * Process to create each invidual chart.
   * Process is super create chart to create xy axis => create chart => create grid
   */
  createChart(): void {
    super.createChart();
    this.createLineSeries();
  }

  /**
   * Create Y axis for this chart
   */
  createYAxis() {
    // create blood pressure axis
    this.valueAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.valueAxis.min = 0;
    this.valueAxis.max = 5;
    this.valueAxis.tooltip.disabled = true;
    this.valueAxis.renderer.minWidth = 35;
    this.valueAxis.baseInterval = {
      count: 1,
    };
    this.valueAxis.renderer.grid.template.disabled = true;
    this.valueAxis.renderer.labels.template.disabled = true;
    this.valueAxis.renderer.labels.template.fontSize = 12;

    this.XValue.forEach((item) => {
      const range = this.valueAxis.axisRanges.create();
      range.value = item.value;
      range.grid.opacity = 0;
      range.label.text = item.text;
      range.label.fill = this.labelColor;
    });
  }

  /**
   * Create body stepCount series
   *
   */
  createLineSeries() {
    const riserSeries = this.contentChart.series.push(new am4charts.ColumnSeries());
    riserSeries.yAxis = this.valueAxis;
    riserSeries.dataFields.dateX = 'date';
    riserSeries.dataFields.valueY = 'riserEnd';
    riserSeries.dataFields.openDateX = 'startDate';
    riserSeries.dataFields.openValueY = 'riserStart';
    riserSeries.columns.template.width = 1;
    riserSeries.strokeWidth = 0;
    riserSeries.fill = am4core.color('#BFBFBF');
    riserSeries.stroke = am4core.color('#BFBFBF');
    riserSeries.clustered = false;

    const lineSeries = this.contentChart.series.push(new am4charts.ColumnSeries());
    lineSeries.yAxis = this.valueAxis;
    lineSeries.dataFields.dateX = 'date';
    lineSeries.dataFields.valueY = 'lineValue';
    lineSeries.dataFields.openValueY = 'lineValue';
    lineSeries.stroke = am4core.color('#BFBFBF');
    lineSeries.columns.template.width = am4core.percent(101);
    lineSeries.strokeWidth = 1;
    this.dateAxis.renderer.cellStartLocation = 0;
    this.dateAxis.renderer.cellEndLocation = 1;
    lineSeries.clustered = false;

    const series = this.contentChart.series.push(new am4charts.ColumnSeries());
    series.yAxis = this.valueAxis;
    series.dataFields.dateX = 'date';
    series.dataFields.valueY = 'mets';
    series.dataFields.openValueY = 'mets';
    series.columns.template.propertyFields.stroke = 'color';
    series.columns.template.width = am4core.percent(101);
    series.strokeWidth = 4;
    this.dateAxis.renderer.cellStartLocation = 0;
    this.dateAxis.renderer.cellEndLocation = 1;
    series.clustered = false;
  }

  /**
   * Get mets value from position
   * @param position : Number
   * @returns Number
   */
  private getMetsValue(position: number): number {
    if (position === 1) return 4;
    if (position === 2 || position === 3) return 3;
    if (position > 3 && position < 8) return 2;
    if (position === 0 || position === 8) return 1;
    return 0;
  }
}
