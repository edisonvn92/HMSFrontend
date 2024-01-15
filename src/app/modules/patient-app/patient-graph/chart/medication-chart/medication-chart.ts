import { BaseChart } from '../base-chart';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { medicationStatus, patientDairyMedication } from '@shared/helpers/data';
import moment from 'moment';

export class MedicationChart extends BaseChart {
  public yAxis: am4charts.Axis | any;
  public openEventModal: ((data: any) => {}) | any;
  public clickBody: any;

  public currentBullet: any;
  private symptom = [
    'ic_heartbeat.svg',
    'ic_dizzy.svg',
    'ic_headache.svg',
    'ic_fever.svg',
    'ic_swelling.svg',
    'ic_cough.svg',
  ];
  private XValue: any = {
    morning: {
      valueY: 55,
      icon_label: 'ic_morning.svg',
      icon_value: 'ic_medicine_morning.svg',
      icon_disable: 'ic_medicine_morning_disable.svg',
      value: patientDairyMedication.MORNING,
      icon_width: 36,
      icon_height: 36,
    },
    noon: {
      valueY: 46,
      icon_label: 'ic_noon.svg',
      icon_value: 'ic_medicine_noon.svg',
      icon_disable: 'ic_medicine_noon_disable.svg',
      value: patientDairyMedication.NOON,
      icon_width: 36,
      icon_height: 36,
    },
    evening: {
      valueY: 37,
      icon_label: 'ic_evening.svg',
      icon_value: 'ic_medicine_evening.svg',
      icon_disable: 'ic_medicine_evening_disable.svg',
      value: patientDairyMedication.EVENING,
      icon_width: 36,
      icon_height: 36,
    },
    bedtime: {
      valueY: 28,
      icon_label: 'ic_bedtime.svg',
      icon_value: 'ic_medicine_bedtime.svg',
      icon_disable: 'ic_medicine_evening_disable.svg',
      value: patientDairyMedication.BEDTIME,
      icon_width: 36,
      icon_height: 36,
    },
    symptom: {
      valueY: 17,
      icon_label: 'ic_note.svg',
      icon_width: 36,
      icon_height: 36,
    },
  };

  /**
   * organize data to prepare for chart
   * @returns organized data
   */
  loadData(): any[] {
    let modifiedData: any[] = [];
    let oldDate = new Date(this.startDate).getTime();
    while (oldDate < new Date(this.endDate).getTime()) {
      modifiedData.push({
        date: new Date(oldDate),
        symptom_value: this.XValue.symptom.valueY,
        evening_value: this.XValue.evening.valueY,
        noon_value: this.XValue.noon.valueY,
        morning_value: this.XValue.morning.valueY,
        bedtime_value: this.XValue.bedtime.valueY,
        morning: medicationStatus.NOT_USE,
        noon: medicationStatus.NOT_USE,
        evening: medicationStatus.NOT_USE,
        bedtime: medicationStatus.NOT_USE,
        symptom: null,
        totalSymptomHtml: null,
        totalSymptom: null,
        symptomTooltip: null,
        index: null,
      });
      oldDate += this.day;
    }
    const dataArray = Object.keys(this.data) as string[];
    dataArray.forEach((key: any) => {
      const dataInDay = this.data[key];
      let index = Math.ceil(
        (moment(`${key} 00:00:00`).toDate().getTime() - new Date(this.startDate).getTime()) / (24 * 3600 * 1000)
      );

      if (modifiedData[index]) {
        modifiedData[index].index = index + 1;
      }
      if (index >= 0 && index < 7) {
        if (dataInDay.patient_diary_symptom && dataInDay.patient_diary_symptom.length > 0) {
          dataInDay.patient_diary_symptom = dataInDay.patient_diary_symptom.filter(
            (event: any) => event < 7 && event > 0
          );
          if (dataInDay.patient_diary_symptom.length > 0) {
            modifiedData[index].symptom = dataInDay.patient_diary_symptom[0];
            modifiedData[index].totalSymptomHtml = this.getTotalSymptomHTML(dataInDay.patient_diary_symptom.length);
            modifiedData[index].totalSymptom = dataInDay.patient_diary_symptom.length;
            modifiedData[index].symptomTooltip = this.getTooltipHTML(dataInDay.patient_diary_symptom);
          }
        }

        Object.keys(this.XValue).forEach((key: string) => {
          if (key !== 'symptom')
            modifiedData[index][key] = dataInDay.patient_diary_medication?.includes(this.XValue[key].value)
              ? medicationStatus.USE
              : medicationStatus.NOT_USE;
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

  createChartContainer() {
    super.createChartContainer();
    this.chartContainer.height = am4core.percent(120);
  }

  /**
   * Create Date Axis for the chart.
   */
  createDateAxis() {
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
    this.dateAxis.renderer.labels.template.disabled = true;
    this.dateAxis.renderer.cellStartLocation = 0;
    this.dateAxis.renderer.cellEndLocation = 1;
    this.dateAxis.height = 0;
    this.dateAxis.renderer.grid.template.disabled = true;
  }

  /**
   * Create Y axis for this chart
   */
  public createYAxis() {
    // create y axis
    this.yAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());

    this.yAxis.min = 5;
    this.yAxis.max = 60;
    this.yAxis.strictMinMax = true;
    this.yAxis.calculateTotals = true;
    if (this.yAxis.tooltip) {
      this.yAxis.tooltip.disabled = true;
    }

    this.yAxis.renderer.grid.template.disabled = true;
    this.yAxis.renderer.labels.template.disabled = true;
    this.yAxis.renderer.labels.template.fontSize = this.labelFontSize;

    // create horizontal line at the top of chart
    const rangeTop = this.yAxis.axisRanges.create();
    rangeTop.value = 60;
    rangeTop.strokeWidth = 1;
    rangeTop.strokeOpacity = 1;
    rangeTop.stroke = am4core.color(this.strokeColor);

    // create horizontal line separating medication and symptom
    const range = this.yAxis.axisRanges.create();
    range.value = 22;
    range.strokeWidth = 1;
    range.strokeOpacity = 1;
    range.stroke = am4core.color(this.strokeColor);

    // create value range
    Object.keys(this.XValue).forEach((key: string) => {
      const range = this.yAxis.axisRanges.create();
      range.value = this.XValue[key].valueY;
      range.grid.opacity = 0;
      range.label.html = `<img src="./assets/images/${this.XValue[key].icon_label}" style="width: 24px; height: 24px">`;
    });
  }

  /**
   * Create body line series
   *
   */
  createLineSeries() {
    Object.keys(this.XValue).forEach((key: string) => {
      const series = this.contentChart.series.push(new am4charts.LineSeries());
      let tooltipHtml = '';
      series.yAxis = this.yAxis;
      series.dataFields.dateX = 'date';
      series.dataFields.valueY = `${key}_value`;
      series.strokeWidth = 0;

      const bullet = series.bullets.push(new am4charts.Bullet());
      const image = bullet.createChild(am4core.Image);
      this.setBulletImgProperties(image, key);

      if (key === 'symptom') {
        const labelBullet = series.bullets.push(new am4charts.LabelBullet());
        let clickBullet = false;
        labelBullet.label.html = '{totalSymptomHtml}';
        labelBullet.label.dx = 13;
        labelBullet.label.dy = -15;

        bullet.alwaysShowTooltip = true;
        bullet.events.on('hit', (ev: any) => {
          if (this.currentBullet) {
            this.currentBullet.tooltip.hide();
          }

          if (ev.target.dataItem.dataContext.totalSymptom > 1) {
            tooltipHtml = ev.target.dataItem.dataContext.symptomTooltip;
            clickBullet = true;

            this.openEventModal({
              html: ev.target.dataItem.dataContext.symptomTooltip,
              index: ev.target.dataItem.dataContext.index,
              isMaxWidth: ev.target.dataItem.dataContext.totalSymptom !== 2,
            });
          }
        });

        this.clickBody = am4core.getInteraction().body.events.on('hit', () => {
          if (!clickBullet) {
            this.openEventModal({ html: tooltipHtml });
          }
          clickBullet = false;
        });
      }
    });
  }

  /**
   * set up properties for circle representing event
   * Create event for circle to change color when event exists
   * @param circle Circle representing event for each series (night and day)
   */
  private setBulletImgProperties(image: am4core.Image, key: string): any {
    image.width = this.XValue[key]?.icon_width;
    image.height = this.XValue[key]?.icon_height;

    image.horizontalCenter = 'middle';
    image.verticalCenter = 'middle';
    image.adapter.add('href', (href: any, target: any) => {
      href = '';
      if (target.dataItem) {
        const d: any = this.contentChart.data.find((dat: any) => {
          return dat.date === target.dataItem.dateX;
        });

        if (key === 'symptom' && d.symptom) {
          image.cursorOverStyle = am4core.MouseCursorStyle.pointer;
          href = this.symptom[d.symptom - 1];
        } else if (d[key] !== medicationStatus.NOT_SETTING) {
          href = d[key] === medicationStatus.USE ? this.XValue[key].icon_value : this.XValue[key].icon_disable;
        }
      }
      return href ? `./assets/images/${href}` : '';
    });
  }

  /**
   * get total symptom html
   * @param totalSymptom
   * @returns
   */
  getTotalSymptomHTML(totalSymptom: number) {
    if (totalSymptom > 1) return `<div class="webview-notification">${totalSymptom}</div>`;
    return '';
  }

  /**
   * get symptom tooltip html
   * @param symptom
   * @returns html string
   */
  getTooltipHTML(symptom: Array<number>) {
    if (symptom && symptom.length) {
      let tooltipHTML = '';

      symptom.forEach((data: number, index: number) => {
        tooltipHTML = `${tooltipHTML}<img src="./assets/images/${this.symptom[data - 1]}" class=" ${
          index % 3 !== 2 && index !== symptom.length - 1 ? 'mr-2' : ''
        } mt-2" style="width: 30px; height: 30px">`;
      });
      return tooltipHTML;
    }
    return '';
  }

  // change tooltip property comparing to base function
  setTooltipProperty(tooltip: am4core.Tooltip): void {
    super.setTooltipProperty(tooltip);
    tooltip.label.interactionsEnabled = true;
    tooltip.dy = -20;
    tooltip.keepTargetHover = true;
  }
}
