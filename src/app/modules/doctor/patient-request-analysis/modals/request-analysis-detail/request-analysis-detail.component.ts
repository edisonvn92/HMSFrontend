import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ShindenService } from '@services/doctor/shinden.service';
import { SharedService } from '@shared/services/shared.service';
import { Subscription } from 'rxjs';
import { ToastService } from '@shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { dataContentSubjectiveSymptoms } from './../../data';
import { downloadPdf, getYearDiff } from '@shared/helpers';
import {
  ECGDataResult,
  exerciseIntensity,
  defaultPatientLanguage,
  heartSubjectiveSymptoms,
} from '@shared/helpers/data';
import { PatientService } from '@services/doctor/patient.service';

@Component({
  selector: 'app-request-analysis-detail',
  templateUrl: './request-analysis-detail.component.html',
  styleUrls: ['./request-analysis-detail.component.scss'],
})
export class RequestAnalysisDetailComponent implements OnInit, OnDestroy {
  @Input() patient: any = {};

  public patientId!: string;
  public bodyRequest = {
    limit: 50,
    page: 1,
  };
  public dataRequestAnalysis: any = {
    data: [],
  };
  public subscriptions: Subscription = new Subscription();
  public dataContentNote = '';
  public dataContentSubjectiveSymptoms = dataContentSubjectiveSymptoms;
  public heartSubjectiveSymptoms = heartSubjectiveSymptoms;
  patientLanguage: string = defaultPatientLanguage;
  public now = new Date();
  public ECGDataResult = ECGDataResult;

  constructor(
    public activeModal: NgbActiveModal,
    public shindenService: ShindenService,
    private toastService: ToastService,
    private translate: TranslateService,
    public patientService: PatientService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getVitalHeartBeatList();
  }

  ngOnDestroy() {
    this.sharedService.showLoadingEventEmitter.emit(false);
    this.subscriptions.unsubscribe();
  }

  /**
   * handle event when scroll event has been called
   * @param event :any
   */
  onScroll(event: any) {
    // hidden tooltip when scroll div has class="list"
    let tooltipList: Array<any> = [
      document.getElementsByClassName('tooltip-inner'),
      document.getElementsByClassName('arrow'),
    ];
    tooltipList.forEach((items: any) => {
      if (items && items.length) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item instanceof HTMLElement) {
            item.className = 'd-none';
          }
        }
      }
    });
  }

  /**
   * Show quantity of vital heart beat shinden symptom
   * @param vitalHeartBeatShindenSymptom
   */
  countSymptom(vitalHeartBeatShindenSymptom: Array<number> | null): string | number {
    if (vitalHeartBeatShindenSymptom && vitalHeartBeatShindenSymptom.length) {
      return vitalHeartBeatShindenSymptom.length === 1 &&
        vitalHeartBeatShindenSymptom.includes(heartSubjectiveSymptoms.NONE)
        ? 0
        : vitalHeartBeatShindenSymptom.length;
    }

    return '-';
  }

  /**
   *  get shinden advice poc list
   */
  public getVitalHeartBeatList() {
    this.subscriptions.add(
      this.shindenService
        .getVitalHeartBeatList({
          patient_id: this.patient.patient_id,
          page: this.bodyRequest.page,
          limit: this.bodyRequest.limit,
          patient_analysis_id: this.patient.patient_analysis_id,
        })
        .subscribe(
          (data: any) => {
            if (data.data) {
              data.data.map((value: any) => {
                value.count_symptom = this.countSymptom(value.vital_heart_beat_shinden_symptom);
              });
            }
            this.dataRequestAnalysis = data;
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
   * shinden analysis download
   */
  public shindenDownloadAnalysis(data: any) {
    if (data.ecg_pdf_converted) {
      if (this.patient.user_language) this.patientLanguage = this.patient.user_language;
      this.subscriptions.add(
        this.patientService
          .shindenAnalysisDownload({
            patient_id: this.patient.patient_id,
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

  /**
   * handle when close is clicked
   */
  clickedClose(): void {
    this.activeModal.dismiss();
  }

  /**
   * get record result text from result type
   * @param resultType result type
   * @returns result text
   */
  getResultText(resultType: number) {
    switch (resultType) {
      case ECGDataResult.NORMAL:
        return 'normal';
      case ECGDataResult.TACHYCARDIA:
        return 'tachycardia';
      case ECGDataResult.BRADYCARDIA:
        return 'bradycardia';
      case ECGDataResult.AFIB_POSSIBLE:
        return 'afib possible';
      case ECGDataResult.NO_ANALYTICS:
        return '(none)';
      case ECGDataResult.UNCLASSIFIED:
        return 'unclassified';
      case ECGDataResult.TOO_SHORT:
        return 'too short';
      case ECGDataResult.TOO_LONG:
        return '(none)';
      case ECGDataResult.UNREADABLE:
        return 'unreadable';
      default:
        return '-';
    }
  }

  /**
   * get exercise intensity text
   * @param intensityCode intensity text code
   * @returns intensity text
   */
  getIntensityText(intensityCode: any) {
    switch (intensityCode) {
      case exerciseIntensity.NOT_ENTERED:
        return '-';
      case exerciseIntensity.STRONG:
        return 'intensity.strong';
      case exerciseIntensity.MEDIUM:
        return 'intensity.medium';
      case exerciseIntensity.WEAK:
        return 'intensity.weak';
      case exerciseIntensity.REST:
        return 'intensity.rest';
      default:
        return '-';
    }
  }

  getYearDiff(startDate: Date | string, endDate: Date | string): number | string {
    return getYearDiff(startDate, endDate);
  }
}
