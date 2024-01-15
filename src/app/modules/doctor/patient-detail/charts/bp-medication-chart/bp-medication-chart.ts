import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { patientDairyMedication } from '@shared/helpers/data';
import moment from 'moment';
import { BaseChart } from '../base-chart';
import { getDiffDate, replaceAllCommentCharacter, scrollToTop } from '@shared/helpers';

export class BPMedicationChart extends BaseChart {
  valueAxis: am4charts.Axis | any;
  currentBullet: any;
  isLeftPointer = false;
  index!: number;
  currentDate: any;
  private symptom = [
    'ic_heartbeat.svg',
    'ic_dizzy.svg',
    'ic_headache.svg',
    'ic_fever.svg',
    'ic_swelling.svg',
    'ic_cough.svg',
    'icon_memo.svg',
  ];
  time = [
    {
      img: '/assets/images/ic_bedtime.svg',
      text: 'bedtime',
      value: patientDairyMedication.BEDTIME,
      valueY: 34,
    },
    {
      img: '/assets/images/icon_evening2.svg',
      text: 'evening',
      value: patientDairyMedication.EVENING,
      valueY: 41,
    },
    {
      img: '/assets/images/icon_noon.svg',
      text: 'noon',
      value: patientDairyMedication.NOON,
      valueY: 48,
    },
    {
      img: '/assets/images/icon_morning2.svg',
      text: 'morning',
      value: patientDairyMedication.MORNING,
      valueY: 55,
    },
    {
      text: 'symptom',
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
    let date = moment(`${this.startDate} 12:00:00`);
    const period = Number(getDiffDate(this.startDate, this.endDate)) + 1;
    do {
      const value = {
        date: date.toDate(),
        symptom_value: 25,
        bedtime_value: 34,
        evening_value: 41,
        noon_value: 48,
        morning_value: 55,
        symptom: null,
        totalSymptomHtml: null,
        symptomTooltip: null,
        memo: '',
      };
      modifiedData.push(value);
      date = date.add(1, 'day');
    } while (date.isBefore(moment(this.endDate).add(1, 'day')));

    Object.values(this.data).map((dataInDay: any) => {
      let index = Number(getDiffDate(this.startDate, dataInDay.patient_diary_ldate));
      if (index >= 0 && index < period) {
        this.time.forEach((item) => {
          modifiedData[index][item.text] = dataInDay.patient_diary_medication.includes(item.value);
        });

        if (dataInDay.patient_diary_symptom?.length || dataInDay.patient_diary_memo) {
          if (dataInDay.patient_diary_symptom?.length) {
            dataInDay.patient_diary_symptom = dataInDay.patient_diary_symptom.filter(
              (item: any) => item >= 0 && item <= 6
            );
            modifiedData[index].symptom = dataInDay.patient_diary_symptom;
            modifiedData[index].totalSymptomHtml = this.getTotalSymptomHTML(dataInDay.patient_diary_symptom.length);
          }
          modifiedData[index].memo = replaceAllCommentCharacter(dataInDay.patient_diary_memo);
        }
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
    this.contentChart.dy = 10;
  }

  /**
   * Create Y axis for this chart
   */
  createYAxis() {
    // create blood pressure axis
    this.valueAxis = this.contentChart.yAxes.push(new am4charts.ValueAxis());
    this.valueAxis.min = 20;
    this.valueAxis.max = 60;
    this.valueAxis.tooltip.disabled = true;
    this.valueAxis.baseInterval = {
      count: 1,
    };
    this.valueAxis.renderer.grid.template.disabled = true;
    this.valueAxis.renderer.labels.template.disabled = true;

    this.time.forEach((item) => {
      const range = this.valueAxis.axisRanges.create();
      range.value = item.valueY;
      range.grid.opacity = 0;
      if (item.text !== 'symptom') {
        range.label.html = `<img src="${item.img}" style="width: 24px; height: 24px">`;
      }
    });

    const range1 = this.valueAxis.axisRanges.create();
    range1.value = 20;

    const range2 = this.valueAxis.axisRanges.create();
    range2.value = 30;
  }

  createDateAxis(): void {
    this.dateAxis = this.contentChart.xAxes.push(new am4charts.DateAxis());
    this.dateAxis.min = moment(this.startDate + ' 00:00:00')
      .toDate()
      .getTime();
    this.dateAxis.max = moment(this.endDate + ' 23:59:59')
      .toDate()
      .getTime();
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
    this.dateAxis.height = 0;
    this.createWeekRange();

    return this.dateAxis;
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

      if (item.text === 'symptom') {
        const bullet = series.bullets.push(new am4charts.Bullet());
        const image = bullet.createChild(am4core.Image);
        this.setBulletImgProperties(image);
        this.setSymptomBulletEvent(bullet);

        const labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.html = '{totalSymptomHtml}';
        labelBullet.label.dx = 11;
        labelBullet.label.dy = -11;
      } else {
        const bullet = series.bullets.push(new am4charts.Bullet());
        const circle = bullet.createChild(am4core.Circle);
        this.setBulletCircleProperties(circle, item.text);
      }
    });
  }

  /**
   * set up properties for circle representing event
   * Create event for circle to change color when event exists
   * @param circle Circle representing event for each series (night and day)
   */
  private setBulletImgProperties(image: am4core.Image): any {
    image.width = 28;
    image.height = 28;

    image.horizontalCenter = 'middle';
    image.verticalCenter = 'middle';
    image.adapter.add('href', (href: any, target: any) => {
      href = '';
      if (target.dataItem) {
        const d: any = this.contentChart.data.find((dat: any) => {
          return dat.date === target.dataItem.dateX;
        });

        image.cursorOverStyle = am4core.MouseCursorStyle.pointer;
        if (d.symptom && d.symptom.length >= 1) {
          href = this.symptom[d.symptom[0] - 1];
        } else if (d.memo) {
          href = this.symptom[6];
        }
      }
      return href ? `./assets/images/${href}` : '';
    });
  }

  /**
   * set up properties for circle representing event
   * Create event for circle to change color when event exists
   * @param circle Circle representing event for each series (night and day)
   */
  private setBulletCircleProperties(circle: am4core.Circle, key: string): any {
    circle.stroke = am4core.color('white');
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

  /**
   * get total symptom html
   * @param totalSymptom
   * @returns
   */
  getTotalSymptomHTML(totalSymptom: number) {
    if (totalSymptom > 1) return `<div class="notification">${totalSymptom}</div>`;
    return '';
  }

  /**
   * get symptom tooltip html
   * @param symptom
   * @returns html string
   */
  getTooltipHTML(symptom: Array<number>, memo: string) {
    let tooltipHTML = '';

    if (symptom && symptom.length) {
      symptom.forEach((data: number, index: number) => {
        tooltipHTML = `${tooltipHTML}<img src="./assets/images/${this.symptom[data - 1]}" class="
          ${index % 3 !== 2 && index !== symptom.length - 1 ? 'mr-2' : ''}
          ${index >= 3 ? 'mt-2' : ''}" style="width: 30px; height: 30px">`;
      });
    }
    if (memo) {
      if (tooltipHTML) {
        tooltipHTML = `${tooltipHTML}<div class="line my-2"></div>`;
      }
      tooltipHTML = `${tooltipHTML}
                    <div class="text-normal break-work text-black-300" style="white-space:pre-wrap">${memo}</div>`;
    }

    return tooltipHTML;
  }

  setSymptomBulletEvent(bullet: any) {
    let isInside = true;
    const middleDate = (new Date(this.startDate).getTime() + new Date(this.endDate).getTime()) / 2;
    bullet.alwaysShowTooltip = true;
    bullet.events.on('hit', (ev: any) => {
      if (this.currentBullet) {
        scrollToTop(this.currentBullet.tooltip.uid);
        this.currentBullet.tooltip.hide();
      }

      this.currentBullet = ev.target;

      let data = this.contentChart.data.find((e: any) => moment(e.date).isSame(moment(this.currentDate), 'day'));

      if (data.symptom || data.memo) {
        let diffDate = Number(getDiffDate(ev.target.dataItem.dateX, data.date));

        this.isLeftPointer = this.currentBullet.dataItem.dateX.getTime() < middleDate ? true : false;
        this.currentBullet.tooltipHTML = `<div id="${this.currentBullet.tooltip.uid}"
                                          class="symptom-tooltip" style="max-height:235px; overflow:auto" >${this.getTooltipHTML(
                                            data.symptom,
                                            data.memo
                                          )}</div>`;
        this.currentBullet.invalidate();
        this.currentBullet.showTooltip();

        this.currentBullet.tooltip.events.on('track', () => {
          isInside = false;

          this.currentBullet.tooltip.events.disableType('track');
          this.currentBullet.tooltip.events.enableType('over');
        });
        this.currentBullet.tooltip.events.on('over', () => {
          isInside = true;
          this.currentBullet.tooltip.events.disableType('over');
          this.currentBullet.tooltip.events.enableType('track');
        });

        if (this.currentBullet.tooltip) {
          this.setTooltipProperty(this.currentBullet.tooltip);
          this.currentBullet.tooltip.dx = diffDate * 10 + (this.isLeftPointer ? 9 : -9);
          this.currentBullet.tooltip.background.fill = am4core.color('#ffffff');
          this.currentBullet.tooltip.background.stroke = am4core.color('#d9d9d9');
          let shadow = this.currentBullet.tooltip.background.filters.push(new am4core.DropShadowFilter());
          shadow.dx = 0;
          shadow.dy = 0;
          shadow.blur = 10;
          shadow.color = am4core.color('#00000030');
        }
      }
    });
    am4core.getInteraction().body.events.on('hit', () => {
      if (this.currentBullet && !isInside) {
        scrollToTop(this.currentBullet.tooltip.uid);
        this.currentBullet.tooltip.hide();
      }
    });
  }

  // change tooltip property comparing to base function
  setTooltipProperty(tooltip: am4core.Tooltip): void {
    super.setTooltipProperty(tooltip);
    tooltip.pointerOrientation = this.isLeftPointer ? 'left' : 'right';
    tooltip.label.minWidth = 100;
    tooltip.label.textAlign = 'middle';
    tooltip.background.fillOpacity = 1;
    tooltip.label.interactionsEnabled = true;
    tooltip.label.padding(0, 0, 0, 0);
    tooltip.label.minWidth = 10;
    tooltip.keepTargetHover = true;
  }

  /**
   * Set up cursor behavior for the chart
   */
  createCursorFullWidth(): void {
    super.createCursorFullWidth();
    this.contentChart.cursor.clickable = true;
    this.contentChart.cursor.events.on('cursorpositionchanged', (ev: any) => {
      var xAxis = ev.target.chart.xAxes.getIndex(0);
      this.currentDate = xAxis.positionToDate(xAxis.toAxisPosition(ev.target.xPosition));
    });
  }
}
