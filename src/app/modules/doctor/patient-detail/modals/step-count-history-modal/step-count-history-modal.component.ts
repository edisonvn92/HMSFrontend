import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PatientService } from '@services/doctor/patient.service';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import { getWeekday, scrollToTop } from '@shared/helpers';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-step-count-history-modal',
  templateUrl: './step-count-history-modal.component.html',
  styleUrls: ['./step-count-history-modal.component.scss'],
})
export class StepCountHistoryModalComponent implements OnInit, OnDestroy {
  public patientId!: string;

  public bodyRequest = {
    limit: 20,
    page: 1,
    total: 0,
  };
  public stepCountHistory: any = {
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
    this.getStepCountHistory();
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
    this.getStepCountHistory();
  }

  /**
   * get step count history
   */
  public getStepCountHistory() {
    scrollToTop('history-content');
    this.subscriptions.add(
      this.patientService
        .getUserStat({
          patient_id: this.patientId,
          page: this.bodyRequest.page,
          attributes: ['user_stat_step_count'],
          limit: this.bodyRequest.limit,
        })
        .subscribe(
          (data) => {
            data.data.map((userStat: any, index: number) => {
              if (index === 0) {
                userStat.is_start_month = true;
              } else {
                userStat.is_start_month =
                  userStat.user_stat_ldate && data.data[index - 1].user_stat_ldate
                    ? userStat.user_stat_ldate.substring(0, 7) !== data.data[index - 1].user_stat_ldate.substring(0, 7)
                    : false;
              }
            });
            this.stepCountHistory = data;
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
    return getWeekday(datetime);
  }
}
