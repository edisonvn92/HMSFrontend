import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PatientService } from '@services/doctor/patient.service';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import { fixNumber, getWeekday, scrollToTop } from '@shared/helpers';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-body-weight-history-modal',
  templateUrl: './body-weight-history-modal.component.html',
  styleUrls: ['./body-weight-history-modal.component.scss'],
})
export class BodyWeightHistoryModalComponent implements OnInit, OnDestroy {
  public patientId!: string;

  public bodyRequest = {
    limit: 20,
    page: 1,
    total: 0,
  };
  public bodyWeightHistory: any = {
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
    this.getBodyWeightHistory();
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
    this.getBodyWeightHistory();
  }

  public getBodyWeightHistory() {
    scrollToTop('history-content');
    this.subscriptions.add(
      this.patientService
        .getBodyWeightHistory({
          patient_id: this.patientId,
          page: this.bodyRequest.page,
          limit: this.bodyRequest.limit,
        })
        .subscribe(
          (data) => {
            data.data.map((userStat: any, index: number) => {
              userStat.vital_weight_ldatetime = userStat.vital_weight_ldatetime || '';
              if (index === 0) {
                userStat.is_start_month = true;
              } else {
                userStat.is_start_month =
                  userStat.vital_weight_ldatetime && data.data[index - 1].vital_weight_ldatetime
                    ? userStat.vital_weight_ldatetime.substring(0, 7) !==
                      data.data[index - 1].vital_weight_ldatetime.substring(0, 7)
                    : false;
              }
            });
            this.bodyWeightHistory = data;
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
   * @param numberFix -
   */
  public fixNumber(value: number, numberFix: number = 1): string {
    return fixNumber(value, numberFix);
  }

  /**
   * get weekday from datetime
   *
   * @param datetime - string
   */
  getWeekday(datetime: string): string {
    return getWeekday(datetime, true);
  }
}
