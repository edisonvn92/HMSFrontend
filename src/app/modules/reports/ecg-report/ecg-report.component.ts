import { Component, OnInit } from '@angular/core';
import { PatientService } from '@data/services/doctor/patient.service';
import { TranslateService } from '@ngx-translate/core';
import { defaultPatientLanguage, report } from '@shared/helpers/data';
import moment from 'moment';

@Component({
  selector: 'app-ecg-report',
  templateUrl: './ecg-report.component.html',
  styleUrls: ['./ecg-report.component.scss'],
})
export class EcgReportComponent implements OnInit {
  totalPage = 2;
  data1Month: any[] = [];
  data12Month: any[] = [];
  dataByDate: any[] = [];
  dataByDay: any[] = [];
  dataBySymptom: any[] = [];
  recordCountPerPage = 24;
  reportData: any = {};
  recordList: any[] = [];
  language: string = defaultPatientLanguage;
  supportedLanguages = Object.keys(report);
  patient: any = {};
  timezone_offset: number = 0;
  recordDate: Date = new Date();
  endDate: Date = new Date();
  textCodeChart2: string = '';

  constructor(private patientService: PatientService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.reportData = this.patientService.getReportData();
    if (this.reportData) {
      if (this.reportData.patient) {
        this.patient = this.reportData.patient;
        if (this.supportedLanguages.includes(this.reportData.patient?.user?.user_language))
          this.language = this.reportData.patient?.user?.user_language || defaultPatientLanguage;
      }
      if (this.reportData.timezone_offset) this.timezone_offset = this.reportData.timezone_offset;
      if (this.reportData.export_datetime) {
        this.recordDate = moment(this.reportData.export_datetime).subtract(this.timezone_offset, 'minutes').toDate();
      } else {
        this.recordDate = moment().subtract(this.timezone_offset, 'minutes').toDate();
      }
      if (this.reportData.endDate) {
        this.endDate = moment(this.reportData.endDate).toDate();
      }
      if (this.reportData.data1Month) {
        if (this.reportData.data1Month.vitals) {
          this.data1Month = [...this.reportData.data1Month.vitals].map((data, index) => {
            data.order = index + 1;
            return data;
          });
          this.splitRecordList(this.reportData.data1Month.vitals);
        }
        this.dataByDate = this.reportData.data1Month.groupByDate ? this.reportData.data1Month.groupByDate : [];
        this.dataByDay = this.reportData.data1Month.groupByDay ? this.reportData.data1Month.groupByDay : [];
        this.dataBySymptom = this.reportData.data1Month.groupBySymptom ? this.reportData.data1Month.groupBySymptom : [];
      }
      if (this.reportData.chart2) this.textCodeChart2 = this.reportData.chart2;
      this.data12Month = this.reportData.data12Month ? this.reportData.data12Month : [];
    }
    this.translate.use(this.language);
  }

  /**
   * split record list to match each page
   * @param recordList record list
   */
  splitRecordList(recordList: any[]) {
    while (recordList.length) {
      let records = recordList.splice(0, this.recordCountPerPage);
      this.recordList.push(records);
    }
    this.totalPage = this.recordList.length + 1;
  }
}
