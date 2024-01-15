import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PatientService } from '@services/doctor/patient.service';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { scrollToTop, fixNumber, getWeekday } from '@shared/helpers';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-temperature-history-modal',
  templateUrl: './temperature-history-modal.component.html',
  styleUrls: ['./temperature-history-modal.component.scss'],
})
export class TemperatureHistoryModalComponent implements OnInit, OnDestroy {
  public patientId!: string;

  public bodyRequest = {
    limit: 20,
    page: 1,
    total: 0,
  };
  public temperatureHistory: any = {
    per_page: 20,
    total: 0,
    data: [],
  };
  public subscriptions: Subscription = new Subscription();

  constructor(
    public activeModal: NgbActiveModal,
    public patientService: PatientService,
    public sharedService: SharedService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getTemperatureHistory();
  }

  ngOnDestroy() {
    this.sharedService.showLoadingEventEmitter.emit(false);
    this.subscriptions.unsubscribe();
  }

  /**
   * handle when page changed
   * @param data
   */
  public pageChange(data?: any): void {
    if (data) {
      this.bodyRequest.page = data.page;
    }
    this.getTemperatureHistory();
  }

  public getTemperatureHistory() {
    scrollToTop('history-content');
    this.subscriptions.add(
      this.patientService
        .getTemperatureHistory({
          patient_id: this.patientId,
          page: this.bodyRequest.page,
          limit: this.bodyRequest.limit,
        })
        .subscribe(
          (data) => {
            data.data.map((userStat: any, index: number) => {
              if (index === 0) {
                userStat.is_start_month = true;
              } else {
                userStat.is_start_month =
                  userStat.vital_temperature_utc_time && data.data[index - 1].vital_temperature_utc_time
                    ? userStat.vital_temperature_utc_time.substring(0, 7) !==
                      data.data[index - 1].vital_temperature_utc_time.substring(0, 7)
                    : false;
              }
            });
            this.temperatureHistory = data;
            this.sharedService.showLoadingEventEmitter.emit(false);
          },
          (err) => {
            this.sharedService.showLoadingEventEmitter.emit(false);
            let errMessage = err.error.message ? err.error.message : this.translate.instant('error.server');
            this.toastService.show(errMessage, { className: 'bg-red-100' });
          }
        )
    );
  }

  /**
   * handle when close is clicked
   */
  clickedClose(): void {
    this.activeModal.dismiss();
  }

  /**
   * take numberFix digit after comma
   *
   * @param value - value need handle
   */
  public fixNumber(value: number): string {
    return fixNumber(value, 2);
  }

  /**
   * get weekday from datetime
   *
   * @param datetime - string
   */
  getWeekday(datetime: string): string {
    return getWeekday(datetime);
  }
}
