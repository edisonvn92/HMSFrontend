import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PatientService } from '@services/doctor/patient.service';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import {
  getBackgroundColorFollowLevel,
  getRiskLevel,
  scrollToTop,
  getWeekday,
  getSysBloodPressureFollowLevel,
  getDiaBloodPressureFollowLevel,
} from '@shared/helpers';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ranking-history-modal',
  templateUrl: './ranking-history-modal.component.html',
  styleUrls: ['./ranking-history-modal.component.scss'],
})
export class RankingHistoryModalComponent implements OnInit, OnDestroy {
  public patientId!: string;
  public hospitalSetting: any = {};

  public bodyRequest = {
    limit: 20,
    page: 1,
    total: 0,
  };
  public rankingHistory: any = {
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
    this.getRankingHistory();
  }

  ngOnDestroy() {
    this.sharedService.showLoadingEventEmitter.emit(false);
    this.subscriptions.unsubscribe();
  }

  public pageChange(data?: any): void {
    if (data) {
      this.bodyRequest.page = data.page;
    }
    this.getRankingHistory();
  }

  /**
   * Get ranking history (sort desc)
   */
  getRankingHistory() {
    scrollToTop('history-content');
    this.subscriptions.add(
      this.patientService
        .getRankingHistory({
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
                  userStat.patient_stat_ldate && data.data[index - 1].patient_stat_ldate
                    ? userStat.patient_stat_ldate.substring(0, 7) !==
                      data.data[index - 1].patient_stat_ldate.substring(0, 7)
                    : false;
              }
            });
            this.rankingHistory = data;
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
   * get background color follow level
   *
   * @param level - include L | M | MH | H
   */
  public getBackgroundColorFollowLevel(level: string): string {
    return getBackgroundColorFollowLevel(level);
  }

  /**
   * Get level blood pressure follow sys and dia
   *
   * @param sysBloodPressure - number type
   * @param diaBloodPressure - number type
   */
  public getRiskLevel(sysBloodPressure: number, diaBloodPressure: number): string {
    return getRiskLevel(sysBloodPressure, diaBloodPressure, this.hospitalSetting);
  }

  /**
   * get weekday from datetime
   *
   * @param datetime - string
   */
  getWeekday(datetime: string): string {
    return getWeekday(datetime);
  }

  /**
   * Get level blood pressure follow sys
   *
   * @param sysBloodPressure - number type
   */
  public getSysBloodPressureFollowLevel(sysBloodPressure: number): string {
    return getSysBloodPressureFollowLevel(sysBloodPressure, this.hospitalSetting);
  }

  /**
   * Get level blood pressure follow dia
   *
   * @param diaBloodPressure - number type
   */
  public getDiaBloodPressureFollowLevel(diaBloodPressure: number): string {
    return getDiaBloodPressureFollowLevel(diaBloodPressure, this.hospitalSetting);
  }
}
