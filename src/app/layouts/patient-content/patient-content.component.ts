import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IHospitalInfo } from '@data/models/hospital';
import { RegistrationService } from '@data/services/registration/registration.service';
import { SharedService } from '@shared/services/shared.service';
import { StorageService } from '@shared/services/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-content',
  templateUrl: './patient-content.component.html',
  styleUrls: ['./patient-content.component.scss'],
})
export class PatientContentComponent implements OnInit, OnDestroy {
  error = false;
  hospital: IHospitalInfo | any;
  public subscriptions: Subscription = new Subscription();
  public isRegistrationScreen = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private registrationService: RegistrationService,
    private sharedService: SharedService,
    private storageService: StorageService
  ) {
    document.body.className = 'into-patient-content';
  }

  ngOnInit() {
    if (this.router.url.includes('top')) {
      this.isRegistrationScreen = true;
      const hospitalCode = this.route.snapshot.queryParams['hospital_code'];
      this.subscriptions.add(
        this.registrationService.getHospitalInfo(hospitalCode).subscribe(
          (hospital: IHospitalInfo) => {
            this.hospital = hospital;
            this.sharedService.showLoadingEventEmitter.emit(false);
          },
          (error) => {
            this.error = true;
            this.sharedService.showLoadingEventEmitter.emit(false);
          }
        )
      );
    } else if (!this.storageService.getFromLocal('isWebView')) {
      this.isRegistrationScreen = true;
      this.hospital = this.registrationService.getCurrentHospital();
      if (!this.hospital) this.error = true;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    document.body.className = '';
  }
}
