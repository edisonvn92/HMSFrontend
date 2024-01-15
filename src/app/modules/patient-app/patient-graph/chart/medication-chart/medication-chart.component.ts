import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MedicationChart } from './medication-chart';

@Component({
  selector: 'app-medication-chart',
  templateUrl: './medication-chart.component.html',
  styleUrls: ['./medication-chart.component.scss'],
})
export class MedicationChartComponent implements OnInit, OnChanges {
  @Input() startDate!: Date;
  @Input() endDate!: Date;
  @Input() chartData: any = {};

  public medicationChart: MedicationChart | any;
  public showPopup = false;
  public popupLocate!: string;
  public isInside = false;
  public popupHtml = '';
  public popupIndex!: number;
  public popupMaxWidth!: boolean;
  public screenWidth = window.innerWidth;

  constructor(public translateService: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if the period changes reboot the whole chart
    // create chart when new data arrive

    if (changes.chartData && this.medicationChart && this.chartData) {
      this.showPopup = false;
      this.medicationChart.data = this.chartData;
      this.medicationChart.openEventModal = this.openEventModal;
      this.loadChart();
      this.medicationChart.createChart();
    }
  }

  ngOnInit(): void {
    this.medicationChart = new MedicationChart(this.startDate, this.endDate, 'medication-chart', this.translateService);
    window.onresize = this.resize;
    this.medicationChart.openEventModal = this.openEventModal;
  }

  /**
   * handle when screen resize
   */
  resize = () => {
    this.showPopup = false;
    setTimeout(() => {
      this.screenWidth = window.innerWidth;
      this.calculatePopupLocate();
      this.showPopup = true;
    }, 0);
  };

  /**
   * calculate popup locate with screen width
   */
  calculatePopupLocate() {
    let locate = ((2 * this.popupIndex - 1) * (this.screenWidth - 70)) / 14 - 18;
    locate = this.popupMaxWidth ? locate : locate + 22;

    if (this.popupIndex < 7) {
      this.popupLocate = `${locate}px`;
    } else {
      this.popupLocate = `${this.popupMaxWidth ? locate - 32 : locate - 22}px`;
    }
  }

  /**
   * open detail popup
   * @param cursorPosition cursor position sent from chart
   */
  openEventModal = (data: any) => {
    setTimeout(() => {
      this.popupHtml = '';
      if (data.index) {
        this.popupHtml = data.html;
        this.showPopup = true;
        this.popupIndex = data.index;
        this.popupMaxWidth = data.isMaxWidth;
        this.calculatePopupLocate();
      } else if (!this.isInside) {
        this.showPopup = false;
      }
    }, 0);
  };

  /**
   * load chart by disposing old chart and create new chart
   */
  loadChart() {
    if (this.medicationChart) {
      this.medicationChart.dispose();
      this.medicationChart.startDate = this.startDate;
      this.medicationChart.endDate = this.endDate;
      this.medicationChart.clickBody?.dispose();
      this.medicationChart.boot();
    }
  }

  /**
   * Check mouse is inside the modal
   * @param isInside boolean
   */
  changeInside(isInside: boolean = true): void {
    this.isInside = isInside;
  }
}
