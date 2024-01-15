import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseChart } from '../base-chart';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { patientReviewItem, reviewMets } from '@shared/helpers/data';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-review-heart-failure',
  templateUrl: './review-heart-failure.component.html',
  styleUrls: ['./review-heart-failure.component.scss'],
})
export class ReviewHeartFailureComponent implements OnInit, OnChanges {
  @Input() startDate: string | Date = new Date();
  @Input() endDate: string | Date = new Date();
  @Input() patient: any;

  showChart = true;
  reviewHeartFailureChart: BaseChart | any;

  constructor(private translateService: TranslateService, public sharedService: SharedService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if the period changes reboot the whole chart
    // create chart when new data arrive
    if (changes.patient && this.reviewHeartFailureChart && this.patient) {
      this.reviewHeartFailureChart.data = this.patient;
      this.loadChart();
      this.reviewHeartFailureChart.createChart();
    }
  }

  ngOnInit(): void {
    this.reviewHeartFailureChart = new ReviewHeartFailureChart(
      this.startDate,
      this.endDate,
      'review-heart-failure-chart',
      this.translateService
    );
  }

  /**
   * load chart by disposing old chart and create new chart
   */
  loadChart() {
    if (this.reviewHeartFailureChart) {
      this.reviewHeartFailureChart.dispose();
      this.reviewHeartFailureChart.startDate = this.startDate;
      this.reviewHeartFailureChart.endDate = this.endDate;
      this.reviewHeartFailureChart.boot();
    }
  }

  /**
   * function when toggle show hide button
   */
  toggleChart() {
    this.showChart = !this.showChart;
  }
}

export class ReviewHeartFailureChart extends BaseChart {
  valueAxis: am4charts.Axis | any;
  levelValueAxis: am4charts.Axis | any;
  step = 110;
  XValue: any = {
    estimated_nyha: {
      value: this.step * 8.5,
      text: 'estimated NYHA',
      level_value: '[M]',
      value_check: null,
    },
    jog: {
      value: this.step * 7.5,
      text: 'jog',
      level_value: '6.0',
      value_check: patientReviewItem.JOG,
    },
    bathing: {
      value: this.step * 6.5,
      text: 'bathing',
      level_value: '5.0',
      value_check: patientReviewItem.BATHING,
    },
    walk_fast: {
      value: this.step * 5.5,
      text: 'walk fast',
      level_value: '4.3',
      value_check: patientReviewItem.WALK_FAST,
    },
    stairs: {
      value: this.step * 4.5,
      text: 'stairs',
      level_value: '4.0',
      value_check: patientReviewItem.STAIRS,
    },
    take_a_walk: {
      value: this.step * 3.5,
      text: 'take a walk',
      level_value: '3.5',
      value_check: patientReviewItem.TAKE_A_WALK,
    },
    change_clothes: {
      value: this.step * 2.5,
      text: 'change clothes',
      level_value: '2.5',
      value_check: patientReviewItem.CHANGE_CLOTHES,
    },
    indoor_walking: {
      value: this.step * 1.5,
      text: 'indoor walking',
      level_value: '2.0',
      value_check: patientReviewItem.INDOOR_WALKING,
    },
    toilet: {
      value: this.step / 2,
      text: 'toilet',
      level_value: '1.8',
      value_check: patientReviewItem.TOILET,
    },
  };
  colorActive: string = '#003153';

  createChartContainer(containerId: string) {
    super.createChartContainer(containerId);
  }

  /**
   * handle tooltip
   *
   * @param dataInDay
   * @param reviewMetLevel
   */
  getTooltipHTML(dataInDay: any, reviewMetLevel: string): string {
    let htmlString = `<div class="activity-item">
            <div class="left">${this.translate.instant('minimum METs')}</div>
            <div class="right">${
              reviewMets[dataInDay.patient_review_mets] ? reviewMets[dataInDay.patient_review_mets]['value'] : '-'
            }</div>
        </div>
        <div class="activity-item">
            <div class="left">${this.translate.instant('nyha')}</div>
            <div class="right">${reviewMetLevel || '-'}</div>
        </div>
        `;

    let activityList = '';
    if (dataInDay.patient_review_item && dataInDay.patient_review_item.length) {
      dataInDay.patient_review_item.forEach((activity: any) => {
        activityList = `${activityList}
            <div class="activity-item">
                <div class="left">${this.translate.instant(reviewMets[activity]['activity_name'])}</div>
                <div class="right">${reviewMets[activity]['value']}</div>
            </div>`;
      });
      activityList = `<div class="activity-list">${activityList}</div>`;
    }
    if (dataInDay.patient_review_item && dataInDay.patient_review_item.length) {
      htmlString = `${htmlString}<div class="line"></div>${activityList}`;
    }
    htmlString = `<div style="min-width: 194px;" class="review-heart-beat-tooltip">${htmlString}</div>`;
    return htmlString;
  }

  /**
   * organize data to prepare for chart
   * @returns organized data
   */
  loadData(): any[] {
    let modifiedData: any[] = [];

    Object.values(this.data).map((dataInDay: any) => {
      const reviewMetLevel = reviewMets[dataInDay.patient_review_mets]
        ? reviewMets[dataInDay.patient_review_mets]['level']
        : '';
      const value = {
        date: new Date(dataInDay.patient_review_ldate),
        tooltip: this.getTooltipHTML(dataInDay, reviewMetLevel),
        met_level: reviewMetLevel,
        patient_review_mets: dataInDay.patient_review_mets,
        patient_review_item: dataInDay.patient_review_item || [],
        estimated_nyha: this.XValue.estimated_nyha.value,
        jog: this.XValue.jog.value,
        bathing: this.XValue.bathing.value,
        walk_fast: this.XValue.walk_fast.value,
        stairs: this.XValue.stairs.value,
        take_a_walk: this.XValue.take_a_walk.value,
        change_clothes: this.XValue.change_clothes.value,
        indoor_walking: this.XValue.indoor_walking.value,
        toilet: this.XValue.toilet.value,
      };

      if (value.date) {
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
    super.createCursorFullWidth();
    this.createLineSeries();
  }

  /**
   * Create Y axis for this chart
   */
  createYAxis() {
    // create activity axis
    this.valueAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.valueAxis.min = 0;
    this.valueAxis.max = 1000;
    this.valueAxis.tooltip.disabled = true;
    this.valueAxis.renderer.minWidth = 35;
    this.valueAxis.baseInterval = {
      count: 1,
    };
    this.valueAxis.renderer.grid.template.disabled = true;
    this.valueAxis.renderer.labels.template.disabled = true;
    this.valueAxis.renderer.labels.template.fontSize = 12;

    // create stroke dash array range
    Array.from(Array(7).keys()).forEach((number) => {
      const range = this.valueAxis.axisRanges.create();
      range.value = (number + 1) * this.step;
      range.grid.strokeDasharray = '4';
      range.grid.opacity = 1;
    });

    //create line range
    const range = this.valueAxis.axisRanges.create();
    range.value = 880;
    range.grid.opacity = 1;

    // create levelValueAxis opposite
    this.levelValueAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.levelValueAxis.min = 0;
    this.levelValueAxis.max = 1000;
    this.levelValueAxis.tooltip.disabled = true;
    this.levelValueAxis.renderer.grid.template.disabled = true;
    this.levelValueAxis.renderer.labels.template.disabled = true;
    this.levelValueAxis.renderer.labels.template.fontSize = 12;
    this.levelValueAxis.renderer.opposite = true;

    // create value range
    Object.keys(this.XValue).forEach((key: string) => {
      const range = this.valueAxis.axisRanges.create();
      range.value = this.XValue[key].value;
      range.grid.opacity = 0;
      range.label.html = `${this.translate.instant(this.XValue[key].text)}`;
      range.label.fill = this.labelColor;

      const rangeRight = this.levelValueAxis.axisRanges.create();
      rangeRight.value = this.XValue[key].value;
      rangeRight.grid.opacity = 0;
      rangeRight.label.html = `${this.XValue[key].level_value}`;
      rangeRight.label.fill = key === 'estimated_nyha' ? am4core.color('#7C8E99') : this.labelColor;
    });
  }

  /**
   * Create body stepCount series
   *
   */
  createLineSeries() {
    Object.keys(this.XValue).forEach((key: string) => {
      const series = this.contentChart.series.push(new am4charts.LineSeries());
      series.yAxis = this.valueAxis;
      series.dataFields.dateX = 'date';
      series.dataFields.valueY = key;
      series.strokeWidth = 0;

      if (key !== 'estimated_nyha') {
        const bullet = series.bullets.push(new am4charts.Bullet());
        const bulletCircle = bullet.createChild(am4core.Circle);
        bulletCircle.stroke = am4core.color('white');
        bulletCircle.radius = 4;
        bulletCircle.fill = am4core.color(this.colorActive);

        this.setBulletCircleProperties(bulletCircle, key);

        if (series.tooltip && key === 'take_a_walk') {
          this.setTooltipProperty(series.tooltip);
          bullet.tooltipHTML = '{tooltip}';
        }
      } else {
        let labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.text = '{met_level}';
        labelBullet.label.fill = am4core.color(this.colorActive);
      }
    });
  }

  // change tooltip property comparing to base function
  setTooltipProperty(tooltip: am4core.Tooltip): void {
    super.setTooltipProperty(tooltip);
    tooltip.pointerOrientation = 'horizontal';
  }

  /**
   * set up properties for circle representing event
   * Create event for circle to change color when event exists
   * @param circle Circle representing event for each series
   * @param activity
   */
  private setBulletCircleProperties(circle: am4core.Circle, activity: string): any {
    circle.stroke = am4core.color('white');
    circle.radius = 4;
    circle.fill = am4core.color('white');

    // change color depend on day value
    circle.adapter.add('fill', (fill: any, target: any) => {
      if (target.dataItem) {
        const d: any = this.contentChart.data.find((data: any) => {
          return data.date === target.dataItem.dateX;
        });

        if (d && d.patient_review_item.includes(this.XValue[activity]['value_check'])) {
          return am4core.color(this.colorActive);
        }
      }
      return fill;
    });
  }
}
