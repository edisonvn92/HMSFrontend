import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseChart } from '../base-chart';
import { BPMedicationChart } from './bp-medication-chart';
import { BPMedicationPlanChart } from './bp-medication-plan-chart';

@Component({
  selector: 'app-bp-medication-chart',
  templateUrl: './bp-medication-chart.component.html',
  styleUrls: ['./bp-medication-chart.component.scss'],
})
export class BPMedicationChartComponent implements OnInit, OnChanges {
  @Input() startDate: string | Date = new Date();
  @Input() endDate: string | Date = new Date();
  @Input() patient: any;
  @Input() prescriptions: any;
  @Output() openPrescription: EventEmitter<any> = new EventEmitter<any>();

  public showChart = true;
  public bpMedicationChart: BaseChart | any;
  public bpMedicationPlanChart: BaseChart | any;
  public typeChart = {
    MEDICATION_CHART: 1,
    MEDICATION_PLAN_CHART: 2,
  };

  constructor(private translateService: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if the period changes reboot the whole chart
    // create chart when new data arrive
    if (changes.prescriptions && this.bpMedicationPlanChart && this.prescriptions) {
      this.bpMedicationPlanChart.prescriptions = this.prescriptions;
      this.loadChart(this.typeChart.MEDICATION_PLAN_CHART);
      this.bpMedicationPlanChart.createChart();
    }

    if (changes.patient && this.bpMedicationChart && this.patient) {
      this.bpMedicationChart.data = this.patient;
      this.loadChart(this.typeChart.MEDICATION_CHART);
      this.bpMedicationChart.createChart();
    }
  }

  ngOnInit(): void {
    this.bpMedicationPlanChart = new BPMedicationPlanChart(
      this.startDate,
      this.endDate,
      'bp-medication-plan-chart',
      this.translateService
    );
    this.bpMedicationChart = new BPMedicationChart(
      this.startDate,
      this.endDate,
      'bp-medication-chart',
      this.translateService
    );
  }

  /**
   * load chart by disposing old chart and create new chart
   */
  loadChart(type: number) {
    if (this.bpMedicationChart && type === this.typeChart.MEDICATION_CHART) {
      this.bpMedicationChart.dispose();
      this.bpMedicationChart.startDate = this.startDate;
      this.bpMedicationChart.endDate = this.endDate;
      this.bpMedicationChart.boot();
    }

    if (this.bpMedicationPlanChart && type === this.typeChart.MEDICATION_PLAN_CHART) {
      this.bpMedicationPlanChart.dispose();
      this.bpMedicationPlanChart.startDate = this.startDate;
      this.bpMedicationPlanChart.endDate = this.endDate;
      this.bpMedicationPlanChart.boot();
    }
  }
}
