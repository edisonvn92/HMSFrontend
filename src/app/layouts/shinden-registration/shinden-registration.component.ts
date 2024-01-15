import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IHospitalInfo } from '@data/models/hospital';
import { RegistrationService } from '@data/services/registration/registration.service';
import { SharedService } from '@shared/services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shinden-registration',
  templateUrl: './shinden-registration.component.html',
  styleUrls: ['./shinden-registration.component.scss'],
})
export class ShindenRegistrationComponent implements OnInit, OnDestroy {
  error = false;
  hospital: IHospitalInfo | any;
  public subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private registrationService: RegistrationService,
    private sharedService: SharedService,
    private router: Router
  ) {
    document.body.className = 'into-patient-content';
  }

  ngOnInit() {
    const hospitalCode = this.route.snapshot.queryParams['hospital_code'];
    this.subscriptions.add(
      this.registrationService.getHospitalInfo(hospitalCode).subscribe(
        (hospital: IHospitalInfo) => {
          if (hospital.hospital_setting?.hospital_setting_shinden_report) {
            this.hospital = hospital;
          } else {
            this.error = true;
            this.router.navigate(['/shinden-registration/shinden-advice/top'], {
              queryParams: { hospital_code: hospitalCode },
            });
          }
          if (!this.router.url.includes('form')) this.sharedService.showLoadingEventEmitter.emit(false);
        },
        (error) => {
          this.error = true;
          this.sharedService.showLoadingEventEmitter.emit(false);
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    document.body.className = '';
  }
}
