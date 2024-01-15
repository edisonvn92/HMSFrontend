import { EventEmitter, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import awsConfig from 'aws-exports';
import { loginType } from '@shared/helpers/data';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  refreshDataEventEmitter = new EventEmitter();
  showLoadingEventEmitter = new EventEmitter();
  closeSidebar = true;
  hospitalSetting: any = {};
  totalPatientHasAlert: number = 0;
  totalPatientAnalysisRequest: number = 0;
  clickReload = false;
  selectedGroupId: number = 0;
  dashboardPatientListSearch = '';

  public cognitoSubject = new Subject<string>();

  constructor(private translate: TranslateService) {}

  /**
   * Emit event refresh data
   */
  refreshData(): void {
    this.refreshDataEventEmitter.emit();
  }

  /**
   * change cognito config
   * @param type
   */
  changeCognitoConfig(type: number) {
    //passing the data as the next observable
    if (type === loginType.ADMIN) {
      this.cognitoSubject.next(awsConfig.awsConfigAdmin);
    } else {
      this.cognitoSubject.next(awsConfig.awsConfigDashboard);
    }
  }

  /**
   * Emit event refresh data
   */
  isJa(): boolean {
    return this.translate.currentLang === 'ja';
  }
}
