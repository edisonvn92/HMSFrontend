import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { fixNumber } from '@shared/helpers';
import { BaseChart } from '../base-chart';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import chart from '@data/json/chart.json';
import { patientDairySymptom } from '@shared/helpers/data';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-subjective-symptom-chart',
  templateUrl: './subjective-symptom-chart.component.html',
  styleUrls: ['./subjective-symptom-chart.component.scss'],
})
export class SubjectiveSymptomChartComponent implements OnInit, OnChanges {
  @Input() startDate: string | Date = new Date();
  @Input() endDate: string | Date = new Date();

  public patient = chart.medical_chart;

  showChart = true;
  medicationStatusAppChart: BaseChart | any;

  constructor(private translateService: TranslateService, public sharedService: SharedService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if the period changes reboot the whole chart
    // create chart when new data arrive
    if (changes.patient && this.medicationStatusAppChart && this.patient) {
      this.medicationStatusAppChart.data = this.patient;
      this.loadChart();
      this.medicationStatusAppChart.createChart();
    }
  }

  ngOnInit(): void {
    this.medicationStatusAppChart = new MedicationStatusAppChart(
      this.startDate,
      this.endDate,
      'subjective-symptom-chart',
      this.translateService
    );

    //fake data chart
    this.medicationStatusAppChart.data = this.patient;
    this.loadChart();
    this.medicationStatusAppChart.createChart();
  }

  /**
   * load chart by disposing old chart and create new chart
   */
  loadChart() {
    if (this.medicationStatusAppChart) {
      this.medicationStatusAppChart.dispose();
      this.medicationStatusAppChart.startDate = this.startDate;
      this.medicationStatusAppChart.endDate = this.endDate;
      this.medicationStatusAppChart.boot();
    }
  }
}

export class MedicationStatusAppChart extends BaseChart {
  valueAxis: am4charts.Axis | any;
  XValue: any = {
    swelling: {
      value: 38,
      text: 'swelling',
    },
    shortness_breath: {
      value: 31,
      text: 'shortness of breath',
    },
    palpitations: {
      value: 24,
      text: 'palpitations',
    },
    drop: {
      value: 17,
      text: 'depression',
    },
    insomnia: {
      value: 10,
      text: 'lack of sleep',
    },
    memo: {
      value: 3,
      text: 'memo',
    },
  };

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
        date: new Date(dataInDay.patient_ldate),
        swelling: dataInDay.patient_diary_symptom.includes(patientDairySymptom.SWELLING)
          ? this.XValue.swelling.value
          : undefined,
        shortness_breath: dataInDay.patient_diary_symptom.includes(patientDairySymptom.SHORTNESS_BREATH)
          ? this.XValue.shortness_breath.value
          : undefined,
        palpitations: dataInDay.patient_diary_symptom.includes(patientDairySymptom.PALPITATIONS)
          ? this.XValue.palpitations.value
          : undefined,
        drop: dataInDay.patient_diary_symptom.includes(patientDairySymptom.DROP) ? this.XValue.drop.value : undefined,
        insomnia: dataInDay.patient_diary_symptom.includes(patientDairySymptom.INSOMNIA)
          ? this.XValue.insomnia.value
          : undefined,
        memo: dataInDay.patient_diary_memo ? this.XValue.memo.value : undefined,
        tooltipHTML: this.getTooltipHTML(dataInDay),
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
    this.createLineSeries();
    this.createCursorFullWidth();
  }

  /**
   * Create Y axis for this chart
   */
  createYAxis() {
    // create blood pressure axis
    this.valueAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.valueAxis.min = 0;
    this.valueAxis.max = 40;
    this.valueAxis.tooltip.disabled = true;
    this.valueAxis.renderer.minWidth = 35;
    this.valueAxis.baseInterval = {
      count: 1,
    };
    this.valueAxis.renderer.grid.template.disabled = true;
    this.valueAxis.renderer.labels.template.disabled = true;
    this.valueAxis.renderer.labels.template.fontSize = 12;

    Object.keys(this.XValue).forEach((key: string) => {
      const range = this.valueAxis.axisRanges.create();
      range.value = this.XValue[key].value;
      range.grid.opacity = 0;
      range.label.html = `${this.translate.instant(this.XValue[key].text)}`;
      range.label.fill = this.labelColor;
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

      const bullet = series.bullets.push(new am4charts.Bullet());

      if (key !== 'memo') {
        const bulletCircle = bullet.createChild(am4core.Circle);
        bulletCircle.stroke = am4core.color('white');
        bulletCircle.fill = am4core.color('#003153');
        bulletCircle.radius = 4;
      } else {
        series.tooltipHTML = '{tooltipHTML}';

        if (series.tooltip) {
          this.setTooltipProperty(series.tooltip);
        }
        const image = bullet.createChild(am4core.Image);
        image.width = 17;
        image.height = 13;
        image.horizontalCenter = 'middle';
        image.verticalCenter = 'middle';
        image.adapter.add('href', (href: any, target: any) => {
          href = '';
          if (target.dataItem) {
            const d: any = this.contentChart.data.find((dat: any) => {
              return dat.date === target.dataItem.dateX;
            });
            if (d.memo) href = './assets/images/icon_memo.svg';
          }
          return href;
        });
      }
    });
  }

  // change tooltip property comparing to base function
  setTooltipProperty(tooltip: am4core.Tooltip): void {
    super.setTooltipProperty(tooltip);
    tooltip.label.interactionsEnabled = true;
    tooltip.keepTargetHover = true;
  }

  /**
   * handle tooltip
   *
   * @param dataInDay
   */
  getTooltipHTML(dataInDay: any): string {
    let htmlString = '';
    if (dataInDay.patient_diary_memo) {
      htmlString = `${htmlString}<div>${dataInDay.patient_diary_memo}</div>`;
    }
    if (htmlString) {
      htmlString = `<div id="amchart-tooltip-content">${htmlString}</div>`;
    }
    return htmlString;
  }
}
