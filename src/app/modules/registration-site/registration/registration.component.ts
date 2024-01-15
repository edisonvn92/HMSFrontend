import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationService } from '@data/services/registration/registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationInfoComponent implements OnInit {
  public isConfirm: boolean = false;
  public patient: any;
  constructor(private router: Router, private registrationService: RegistrationService) {}

  ngOnInit(): void {
    if (!this.registrationService.getCurrentHospital()) this.router.navigate(['/registration-site/top']);
  }

  public onConfirmClicked(data?: any): void {
    if (data) {
      this.patient = data;
    }
    this.isConfirm = !this.isConfirm;
  }
}
