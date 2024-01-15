import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BloodPressureChart } from './bp-chart';

@Component({
  selector: 'app-bp-chart',
  templateUrl: './bp-chart.component.html',
  styleUrls: ['./bp-chart.component.scss'],
})
export class BPChartComponent implements OnInit, OnChanges {
  @Input() startDate!: Date;
  @Input() endDate!: Date;
  @Input() chartData: any = {};
  @Input() sysGoal: any = {};
  @Input() diaGoal: any = {};

  public bpChart: BloodPressureChart | any;

  constructor(public translateService: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if the period changes reboot the whole chart
    // create chart when new data arrive

    if (changes.chartData && this.bpChart && this.chartData) {
      this.bpChart.data = this.chartData;
      this.bpChart.patient_sys_goal = this.sysGoal;
      this.bpChart.patient_dia_goal = this.diaGoal;
      this.loadChart();
      this.bpChart.createChart();
    }
  }

  ngOnInit(): void {
    this.bpChart = new BloodPressureChart(this.startDate, this.endDate, 'bp-chart', this.translateService);
  }

  /**
   * load chart by disposing old chart and create new chart
   */
  loadChart() {
    if (this.bpChart) {
      this.bpChart.dispose();
      this.bpChart.startDate = this.startDate;
      this.bpChart.endDate = this.endDate;
      this.bpChart.boot();
    }
  }
}
