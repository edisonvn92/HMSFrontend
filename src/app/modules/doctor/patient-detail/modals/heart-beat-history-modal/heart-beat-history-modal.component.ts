import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PatientService } from '@services/doctor/patient.service';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import { fixNumber, getWeekday, scrollToTop } from '@shared/helpers';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { downloadPdf } from '@shared/helpers';
import { defaultPatientLanguage, ECGDataResult } from '@shared/helpers/data';

import { ShindenService } from '@services/doctor/shinden.service';

@Component({
  selector: 'app-heart-beat-history-modal',
  templateUrl: './heart-beat-history-modal.component.html',
  styleUrls: ['./heart-beat-history-modal.component.scss'],
})
export class HeartBeatHistoryModalComponent implements OnInit, OnDestroy {
  public patient: any = {};
  public patientId!: string;
  public bodyRequest = {
    limit: 20,
    page: 1,
    total: 0,
  };
  public heartBeatHistory: any = {
    per_page: 20,
    total: 0,
    data: [],
  };
  public subscriptions: Subscription = new Subscription();
  patientLanguage: string = defaultPatientLanguage;
  public ECGDataResult = ECGDataResult;

  constructor(
    public shindenService: ShindenService,
    public activeModal: NgbActiveModal,
    public patientService: PatientService,
    public sharedService: SharedService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getHeartBeatHistory();
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
    this.getHeartBeatHistory();
  }

  /**
   * get heart beat history
   */
  public getHeartBeatHistory() {
    scrollToTop('history-content');
    this.subscriptions.add(
      this.patientService
        .getHeartBeatHistory({
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
                  userStat.vital_heart_beat_utc_time && data.data[index - 1].vital_heart_beat_utc_time
                    ? userStat.vital_heart_beat_utc_time.substring(0, 7) !==
                      data.data[index - 1].vital_heart_beat_utc_time.substring(0, 7)
                    : false;
              }
            });
            this.heartBeatHistory = data;
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
    return getWeekday(datetime);
  }

  /**
   * get text and color follow analysis type
   *
   * @param analysisType
   */
  handleAnalysisType(analysisType?: number): { text: string; color: string; background_color: string } {
    let color = '#000000d9';
    let backgroundColor = 'white';
    let text = '-';
    switch (analysisType) {
      case 200: {
        backgroundColor = 'white';
        color = '#000000d9';
        text = 'normal';
        return { text, color, background_color: backgroundColor };
      }
      case 201: {
        backgroundColor = '#ff85b7';
        color = 'white';
        text = 'tachycardia';
        return { text, color, background_color: backgroundColor };
      }
      case 207: {
        backgroundColor = '#ff85b7';
        color = 'white';
        text = 'bradycardia';
        return { text, color, background_color: backgroundColor };
      }
      case 214: {
        backgroundColor = '#923265';
        color = 'white';
        text = 'afib possible';
        return { text, color, background_color: backgroundColor };
      }
      case 218: {
        backgroundColor = 'white';
        color = '#000000d9';
        text = '(none)';
        return { text, color, background_color: backgroundColor };
      }
      case 296: {
        backgroundColor = '#ff85b7';
        color = 'white';
        text = 'unclassified';
        return { text, color, background_color: backgroundColor };
      }
      case 297: {
        backgroundColor = '#9c9c9c';
        color = 'white';
        text = 'too short';
        return { text, color, background_color: backgroundColor };
      }
      case 298: {
        backgroundColor = 'white';
        color = '#000000d9';
        text = '(none)';
        return { text, color, background_color: backgroundColor };
      }
      case 299: {
        backgroundColor = '#9c9c9c';
        color = 'white';
        text = 'unreadable';
        return { text, color, background_color: backgroundColor };
      }
    }

    return { text, color, background_color: backgroundColor };
  }

  /**
   * shinden analysis download
   */
  public shindenDownloadAnalysis(data: any) {
    if (data.ecg_pdf_converted) {
      if (this.patient.user_language) this.patientLanguage = this.patient.user_language;
      this.subscriptions.add(
        this.patientService
          .shindenAnalysisDownload({
            patient_id: this.patientId,
            vital_heart_beat_id: data.vital_heart_beat_id,
          })
          .subscribe(
            (response: any) => {
              let fileName = decodeURIComponent(response.headers.get('content-disposition')!.split('=')[1]);
              fileName = fileName.substring(1, fileName.length - 1);

              downloadPdf(fileName, response.body);
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
  }
}
