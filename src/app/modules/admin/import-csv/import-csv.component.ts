import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UploadCsvService } from '@services/admin/upload-csv.service';
import { ToastService } from '@shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { errorStatus, importStatus } from '@shared/helpers/data';

@Component({
  selector: 'app-import-csv',
  templateUrl: './import-csv.component.html',
  styleUrls: ['./import-csv.component.scss'],
})
export class ImportCsvComponent implements OnInit {
  public form: FormGroup;
  public dataFile: any;
  fileName: string = '';
  fileError: string = '';
  totalColumnSuccess = 0;
  totalColumnError = 0;
  detailColumnError = '';
  importStatus: any = 0;
  timeImport = '';
  columnErr = '';
  totalRecord = 0;
  errorColumn = false;
  public listImportStatus = importStatus;
  maxSize: number = 3 * 1024 * 1024; // max 3MB

  constructor(
    public sharedService: SharedService,
    private uploadCsvService: UploadCsvService,
    public fb: FormBuilder,
    private toastService: ToastService,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
      inputFile: [null],
    });
  }

  ngOnInit(): void {
    this.getImportStatus();
  }

  /**
   * handle event when upload button is clicked
   * @param e
   */
  onClickUpload(e: any) {
    e.target.value = null;
  }

  /**
   * get import status
   */
  getImportStatus() {
    this.uploadCsvService.getImportStatus().subscribe(
      (data) => {
        this.totalColumnError = data.error;
        this.totalColumnSuccess = data.success;
        this.totalRecord = data.total;
        this.detailColumnError = data.error_items;
        this.importStatus = data.import_history_status;
        this.timeImport = data.updated_at;

        this.sharedService.showLoadingEventEmitter.emit();
      },
      () => {
        this.sharedService.showLoadingEventEmitter.emit();
      }
    );
  }

  /**
   * Handle file when choose file
   * @param files
   */
  handleFileInput(files: any) {
    let inputFile = files.target.files[0];

    if (this.importStatus !== this.listImportStatus.INPROGRESS && inputFile) {
      this.fileError = '';
      this.columnErr = '';
      this.errorColumn = false;
      this.dataFile = null;
      this.totalColumnError = 0;
      this.totalColumnSuccess = 0;
      this.detailColumnError = '';
      this.totalRecord = 0;
      this.fileName = inputFile?.name || '';
      let validImageTypes = ['text/csv'];
      if (!validImageTypes.includes(inputFile?.type)) {
        this.importStatus = null;
        this.fileError = 'please upload in CSV file format';
      } else if (inputFile.size > this.maxSize) {
        this.importStatus = null;
        this.fileError = 'please upload the file size';
      }

      if (inputFile && !this.fileError) {
        let data = new FileReader();
        data.onload = function (e) {
          e.target?.result;
        };
        data.readAsText(inputFile);
        this.dataFile = data;

        setTimeout(() => {
          // setTimeout to get data from file
          this.readCSV(files.target.files);
        }, 0);
      }
    }
  }

  /**
   * count record in csv
   * @param files :file csv
   */
  readCSV(files: FileList) {
    if (files && files.length > 0) {
      let file: File = files.item(0) as File;
      //File reader method
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        let csv: any = reader.result;
        let allTextLines = [];
        allTextLines = csv.split('\n');
        let arrLength = allTextLines.length;

        let rows = [];
        for (let i = 1; i < arrLength - 1; i++) {
          let row = allTextLines[i].replaceAll(',', ';').split(';');

          if (row && row.length) {
            rows.push(row);
          }

          if (!row[0].trim() || !row[1].trim() || !row[4].trim()) {
            if (this.columnErr) {
              this.columnErr = `${this.columnErr}, No.${i + 1}`;
            } else {
              this.columnErr = `No.${i + 1}`;
            }
          }
        }

        if (this.columnErr) {
          this.importStatus = null;
        } else {
          this.importStatus = this.listImportStatus.NONE_UPLOAD;
        }
        this.totalRecord = rows.length;
      };
    }
  }

  /**
   * Upload CSV file
   */
  requestUpload() {
    setTimeout(() => {
      this.uploadCsvService.uploadCSV(this.dataFile.__zone_symbol__originalInstance.result).subscribe(
        () => {
          this.fileName = '';
          this.toastService.show(this.translate.instant('CSV file has been uploaded successfully'), {
            className: 'bg-green-200',
          });
          this.getImportStatus();
        },
        (error) => {
          this.dataFile = null;
          // check if error returned is 413 then show error utf-8 format
          if (error.status === errorStatus.REQUEST_TOO_LONG) {
            this.importStatus = null;
            this.fileError = 'incorrect format, please upload UTF-8 format file';
          } else if (error.error) {
            this.fileError = error.error?.message || '';
          }
        }
      );
    }, 0);
  }
}
