import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { environment } from '@env/environment';
import { defaultPatientLanguage, ECGDataResult, report } from '@shared/helpers/data';

export class ECGResultPieChart {
  contentChart: am4charts.PieChart | any;
  public containerId: string = '';
  data: any;
  language: string = defaultPatientLanguage;
  totalCountThisMonth: number | string = '';
  totalCountPreviousMonth: number | string = '';

  /**
   * Constructor for pie chart
   * @param containerId container id
   * @param data data input
   * @param language language of user
   */
  constructor(
    containerId: string,
    data: any,
    language: string,
    totalCountThisMonth: number | string,
    totalCountPreviousMonth: number | string
  ) {
    this.containerId = containerId;
    this.data = data;
    this.language = language;
    this.totalCountThisMonth = totalCountThisMonth;
    this.totalCountPreviousMonth = totalCountPreviousMonth;
    am4core.addLicense(environment.amchart_license_code);
    this.loadData();
    this.createChart();
  }

  /**
   * modify data for the chart
   * @returns modified data
   */
  loadData() {
    let modifiedData: any[] = [
      {
        type: 'normal',
        count: 0,
        outer_color: am4core.color('#264c73'),
        inner_color: am4core.color('#163959'),
      },
      {
        type: 'danger',
        count: 0,
        outer_color: am4core.color('#913b69'),
        inner_color: am4core.color('#72194c'),
      },
      {
        type: 'abnormal',
        count: 0,
        outer_color: am4core.color('#d34c83'),
        inner_color: am4core.color('#913b69'),
      },
      {
        type: 'danger',
        count: 0,
        outer_color: am4core.color('#a4a4a4'),
        inner_color: am4core.color('#666666'),
      },
    ];
    Object.keys(this.data).forEach((type) => {
      switch (Number(type)) {
        case ECGDataResult.NORMAL:
          modifiedData[0].count = this.data[type];
          break;
        case ECGDataResult.AFIB_POSSIBLE:
          modifiedData[1].count = this.data[type];
          break;
        case ECGDataResult.TACHYCARDIA:
        case ECGDataResult.BRADYCARDIA:
          modifiedData[2].count += this.data[type];
          break;
        case ECGDataResult.UNCLASSIFIED:
          modifiedData[3].count = this.data[type];
          break;
      }
    });
    return modifiedData;
  }

  /**
   * Create pie chart
   */
  createChart() {
    this.contentChart = am4core.create(this.containerId, am4charts.PieChart);
    this.contentChart.height = am4core.percent(100);
    this.contentChart.padding(-30, -30, -30, -30);
    this.contentChart.data = this.loadData();
    this.createPieSeries();
    this.createLabel();
  }

  /**
   * create pie series
   */
  createPieSeries() {
    let pieSeries = this.contentChart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'count';
    pieSeries.dataFields.category = 'type';
    pieSeries.radius = 88;
    pieSeries.innerRadius = 78;
    pieSeries.slices.template.stroke = am4core.color('#fff');
    pieSeries.slices.template.strokeWidth = 1;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.propertyFields.fill = 'inner_color';
    // Disabling labels and ticks on inner circle
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;

    let pieSeries2 = this.contentChart.series.push(new am4charts.PieSeries());
    pieSeries2.dataFields.value = 'count';
    pieSeries2.dataFields.category = 'type';
    pieSeries2.innerRadius = 84;
    pieSeries2.slices.template.stroke = am4core.color('#fff');
    pieSeries2.slices.template.strokeWidth = 1;
    pieSeries2.slices.template.strokeOpacity = 1;
    pieSeries2.slices.template.propertyFields.fill = 'outer_color';
    // Disabling labels and ticks on inner circle
    pieSeries2.labels.template.disabled = true;
    pieSeries2.ticks.template.disabled = true;
  }

  /**
   * create label text in the middle of pie chart
   */
  createLabel() {
    var label = this.contentChart.seriesContainer.createChild(am4core.Label);
    label.textAlign = 'middle';
    label.horizontalCenter = 'middle';
    label.verticalCenter = 'middle';
    label.html = `
    <div style="font-size: ${this.language === 'ja' ? '13pt' : '11pt'}; padding-right: 5px; padding-left: 5px">
    ${this.totalCountThisMonth !== '' ? report[this.language].record_count : ''}</div>
    <div style="font-size: 49pt; line-height: 1">${this.totalCountThisMonth}</div>
    <div style="display: flex; font-size: ${this.language === 'ja' ? '13pt' : '11pt'}">
      <div style="padding-left: 5px">${
        this.totalCountPreviousMonth !== '' ? report[this.language].last_month + ':' : ''
      } </div>
      <div style="margin-left: ${this.language === 'ja' ? '10px' : '3px'};  padding-right: 5px">
      ${this.totalCountPreviousMonth}</div>
    </div>
    `;
  }
}
