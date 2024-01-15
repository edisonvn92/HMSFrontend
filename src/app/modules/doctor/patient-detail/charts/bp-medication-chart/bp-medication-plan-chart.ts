import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import moment from 'moment';
import { BaseChart } from '../base-chart';
import { getDiffDate } from '@shared/helpers';

export class BPMedicationPlanChart extends BaseChart {
  valueAxis: am4charts.Axis | any;
  prescriptions: any[] = [];
  cellWidth = 0;
  currentBullet: any;
  isLeftPointer = false;
  time = [
    {
      img: '/assets/images/icon_evening2.svg',
      text: 'evening',
    },
    {
      img: '/assets/images/icon_noon.svg',
      text: 'noon',
    },
    {
      img: '/assets/images/icon_morning2.svg',
      text: 'morning',
    },
    {
      img: '/assets/images/ic_bedtime.svg',
      text: 'bedtime',
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

    this.prescriptions.forEach((data) => {
      this.time.forEach((el: any) => {
        if (data[el.text] && data[el.text].medicines && data[el.text].medicines.length) {
          data[el.text].medicines = data[el.text].medicines.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));
        }
      });

      const startDate = moment(`${data.start} 01:00:00`).isBefore(moment(this.startDate))
        ? moment(`${this.startDate}`).toDate()
        : moment(`${data.start} 01:00:00`).toDate();
      const endDate = moment(`${data.end} 22:00:00`).isAfter(moment(this.endDate).add(1, 'day'))
        ? moment(`${this.endDate} 22:00:00`).add('day').toDate()
        : moment(`${data.end} 22:00:00`).toDate();

      const range =
        1 + Number(getDiffDate(moment(startDate).format('yyyy-MM-DD'), moment(endDate).format('yyyy-MM-DD')));

      const value = {
        start_date: startDate,
        end_date: endDate,
        bedtime_value: data?.bedtime ? 30 : undefined,
        evening_value: data?.evening ? 40 : undefined,
        noon_value: data?.noon ? 50 : undefined,
        morning_value: data?.morning ? 60 : undefined,
        bedtime_open_value: 21,
        evening_open_value: 31,
        noon_open_value: 41,
        morning_open_value: 51,
        color: '#1890ff33',
        label_width: `${this.cellWidth * range - 34}px`,
        display_label: this.cellWidth * range >= 31 ? 'd-flex' : 'd-none',
        morning_medical: this.cellWidth * range >= 34 ? this.getDrugName(data?.morning?.medicines) : '',
        evening_medical: this.cellWidth * range >= 34 ? this.getDrugName(data?.evening?.medicines) : '',
        noon_medical: this.cellWidth * range >= 34 ? this.getDrugName(data?.noon?.medicines) : '',
        bedtime_medical: this.cellWidth * range >= 34 ? this.getDrugName(data?.bedtime?.medicines) : '',
      };

      modifiedData.push(value);
    });

    return modifiedData;
  }

  /**
   * get drug name from array
   * @param drug drug list
   * @returns drug name
   */
  getDrugName(drug: any[]) {
    let drugName = '';
    if (drug) {
      drugName = drug
        .map((data) => data.name)
        .sort((a, b) => {
          if (String(a).toLowerCase() > String(b).toLowerCase()) return 1;
          else return -1;
        })
        .join(', ');
    }

    return drugName;
  }

  /**
   * Process to create each invidual chart.
   * Process is super create chart to create xy axis => create chart => create grid
   */
  createChart(): void {
    super.createChart();
    this.createColumnSeries();
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

    const range = this.valueAxis.axisRanges.create();
    range.value = 40;
    range.grid.opacity = 0;
    range.label.html = '<div style="width: 24px; height: 24px"></div>';
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
      timeUnit: 'hour',
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
    this.createMonthLabel();

    this.dateAxis.events.on('sizechanged', (ev: any) => {
      let axis = ev.target;
      this.cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex - 2);
      this.contentChart.data = this.loadData();
    });

    return this.dateAxis;
  }

  /**
   * Create body stepCount series
   *
   */
  createColumnSeries() {
    this.time.forEach((item) => {
      // create prescription column series
      const prescriptionSeries = this.contentChart.series.push(new am4charts.ColumnSeries());
      prescriptionSeries.yAxis = this.valueAxis;
      prescriptionSeries.dataFields.openDateX = 'start_date';
      prescriptionSeries.dataFields.dateX = 'end_date';
      prescriptionSeries.dataFields.openValueY = `${item.text}_open_value`;
      prescriptionSeries.dataFields.valueY = `${item.text}_value`;

      prescriptionSeries.columns.template.propertyFields.stroke = 'color';
      prescriptionSeries.columns.template.propertyFields.fill = 'color';
      prescriptionSeries.columns.template.column.cornerRadiusTopLeft = 2;
      prescriptionSeries.columns.template.column.cornerRadiusTopRight = 2;
      prescriptionSeries.columns.template.column.cornerRadiusBottomLeft = 2;
      prescriptionSeries.columns.template.column.cornerRadiusBottomRight = 2;
      prescriptionSeries.columns.template.width = am4core.percent(101);
      prescriptionSeries.strokeWidth = 1;

      let labelBullet = prescriptionSeries.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.html = `<div class="{display_label} align-items-center">
                                  <img src="${item.img}" alt="" style="width:24px; height:24px " />
                                  <div class="text-truncate" style="width:{label_width}">{${item.text}_medical}</div>
                                <div>`;
      labelBullet.locationY = 0.5;
      labelBullet.dx = 2;
      labelBullet.label.fill = am4core.color('#264c73');
      labelBullet.label.horizontalCenter = 'left';
    });
  }
}
