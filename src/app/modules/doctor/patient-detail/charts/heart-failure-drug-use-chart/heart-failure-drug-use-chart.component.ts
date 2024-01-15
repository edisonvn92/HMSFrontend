import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseChart } from '../base-chart';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { patientDairyMedication } from '@shared/helpers/data';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-heart-failure-drug-use-chart',
  templateUrl: './heart-failure-drug-use-chart.component.html',
  styleUrls: ['./heart-failure-drug-use-chart.component.scss'],
})
export class HeartFailureDrugUseChartComponent implements OnInit, OnChanges {
  @Input() startDate: string | Date = new Date();
  @Input() endDate: string | Date = new Date();
  @Input() patient: any;

  showChart = true;
  heartFailureDrugUseChart: BaseChart | any;

  constructor(private translateService: TranslateService, public sharedService: SharedService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if the period changes reboot the whole chart
    // create chart when new data arrive
    if (changes.patient && this.heartFailureDrugUseChart && this.patient) {
      this.heartFailureDrugUseChart.data = this.patient;
      this.loadChart();
      this.heartFailureDrugUseChart.createChart();
    }
  }

  ngOnInit(): void {
    this.heartFailureDrugUseChart = new HeartFailureDrugUseChart(
      this.startDate,
      this.endDate,
      'heart-failure-drug-use-chart',
      this.translateService
    );
  }

  /**
   * load chart by disposing old chart and create new chart
   */
  loadChart() {
    if (this.heartFailureDrugUseChart) {
      this.heartFailureDrugUseChart.dispose();
      this.heartFailureDrugUseChart.startDate = this.startDate;
      this.heartFailureDrugUseChart.endDate = this.endDate;
      this.heartFailureDrugUseChart.boot();
    }
  }
}

export class HeartFailureDrugUseChart extends BaseChart {
  valueAxis: am4charts.Axis | any;
  time = [
    {
      img: '/assets/images/icon_morning2.svg',
      text: 'morning',
      value: patientDairyMedication.MORNING,
      valueY: 18,
    },
    {
      img: '/assets/images/icon_noon.svg',
      text: 'noon',
      value: patientDairyMedication.NOON,
      valueY: 13,
    },
    {
      img: '/assets/images/icon_evening2.svg',
      text: 'evening',
      value: patientDairyMedication.EVENING,
      valueY: 8,
    },
    {
      text: 'emergency',
      value: patientDairyMedication.EMERGENCY,
      valueY: 3,
    },
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
    let date = new Date(this.startDate);
    do {
      const value = {
        date: date,

        emergency_value: 3,
        evening_value: 8,
        noon_value: 13,
        morning_value: 18,
      };
      modifiedData.push(value);
      date = new Date(date.getTime() + 24 * 3600 * 1000);
    } while (date <= new Date(this.endDate));

    Object.values(this.data).map((dataInDay: any) => {
      let index =
        (new Date(dataInDay.patient_diary_ldate).getTime() - new Date(this.startDate).getTime()) / (24 * 3600 * 1000);

      if (index >= 0) {
        this.time.forEach((item) => {
          modifiedData[index][item.text] = dataInDay.patient_diary_medication.includes(item.value);
        });
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
    this.createLineSeries();
  }

  /**
   * Create Y axis for this chart
   */
  createYAxis() {
    // create blood pressure axis
    this.valueAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.valueAxis.min = 0;
    this.valueAxis.max = 20;
    this.valueAxis.tooltip.disabled = true;
    this.valueAxis.renderer.minWidth = 35;
    this.valueAxis.baseInterval = {
      count: 1,
    };
    this.valueAxis.renderer.grid.template.disabled = true;
    this.valueAxis.renderer.labels.template.disabled = true;
    this.valueAxis.renderer.labels.template.fontSize = 12;

    this.time.forEach((item) => {
      const range = this.valueAxis.axisRanges.create();
      range.value = item.valueY;
      range.grid.opacity = 0;
      if (item.img) {
        range.label.html = `<img src="${item.img}" style="width: 24px; height: 24px">`;
      } else {
        range.label.text = this.translate.instant(item.text);
        range.label.fill = this.labelColor;
      }
    });
  }

  /**
   * Create body stepCount series
   *
   */
  createLineSeries() {
    this.time.forEach((item) => {
      const series = this.contentChart.series.push(new am4charts.LineSeries());
      series.yAxis = this.valueAxis;
      series.dataFields.dateX = 'date';
      series.dataFields.valueY = `${item.text}_value`;
      series.strokeWidth = 0;

      const bullet = series.bullets.push(new am4charts.Bullet());
      const circle = bullet.createChild(am4core.Circle);
      this.setBulletCircleProperties(circle, item.text);
    });
  }

  /**
   * set up properties for circle representing event
   * Create event for circle to change color when event exists
   * @param circle Circle representing event for each series (night and day)
   */
  private setBulletCircleProperties(circle: am4core.Circle, key: string): any {
    circle.strokeWidth = 0;
    circle.radius = 4;
    circle.fill = am4core.color('#EBEBEB');

    // change color depend on day value
    circle.adapter.add('fill', (fill: any, target: any) => {
      if (target.dataItem) {
        const d: any = this.contentChart.data.find((data: any) => {
          return data.date === target.dataItem.dateX;
        });

        if (d[key]) {
          return am4core.color('#003153');
        }
      }
      return fill;
    });
  }
}
