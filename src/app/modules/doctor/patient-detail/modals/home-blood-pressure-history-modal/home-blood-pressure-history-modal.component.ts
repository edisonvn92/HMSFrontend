import { Component, OnDestroy, OnInit } from '@angular/core';
import { PatientService } from '@data/services/doctor/patient.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { fixNumber, getWeekday, scrollToTop } from '@shared/helpers';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-blood-pressure-history-modal',
  templateUrl: './home-blood-pressure-history-modal.component.html',
  styleUrls: ['./home-blood-pressure-history-modal.component.scss'],
})
export class HomeBloodPressureHistoryModalComponent implements OnInit, OnDestroy {
  patientId = '';
  public bodyRequest = {
    limit: 20,
    page: 1,
    total: 0,
  };
  bloodPressureHistory: any = {
    per_page: 20,
    total: 0,
    data: [],
  };
  public subscriptions: Subscription = new Subscription();

  constructor(
    public activeModal: NgbActiveModal,
    private patientService: PatientService,
    public sharedService: SharedService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getHomeBloodPressureHistory();
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
    this.getHomeBloodPressureHistory();
  }

  /**
   * get home blood pressure history
   */
  getHomeBloodPressureHistory() {
    scrollToTop('history-content');
    this.subscriptions.add(
      this.patientService
        .getHomeBloodPressureHistory({
          patient_id: this.patientId,
          limit: this.bodyRequest.limit,
          page: this.bodyRequest.page,
        })
        .subscribe(
          (data) => {
            data.data.map((userStat: any, index: number) => {
              userStat.vital_bp_ldatetime = userStat.vital_bp_ldatetime || '';
              if (index === 0) {
                userStat.is_start_month = true;
              } else {
                userStat.is_start_month =
                  userStat.vital_bp_ldatetime && data.data[index - 1].vital_bp_ldatetime
                    ? userStat.vital_bp_ldatetime.substring(0, 7) !==
                      data.data[index - 1].vital_bp_ldatetime.substring(0, 7)
                    : false;
              }
            });
            this.bloodPressureHistory = data;
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
   * get weekday from datetime
   *
   * @param datetime - string
   */
  getWeekday(datetime: string): string {
    return getWeekday(datetime, true);
  }

  /**
   * take numberFix digit after comma
   *
   * @param value - value need handle
   * @param numberFix -
   */
  public fixNumber(value: number, numberFix: number = 1): string {
    return fixNumber(value, numberFix);
  }
}
