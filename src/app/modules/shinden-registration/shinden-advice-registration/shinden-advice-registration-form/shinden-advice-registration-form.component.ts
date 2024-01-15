import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationService } from '@data/services/registration/registration.service';

@Component({
  selector: 'app-shinden-advice-registration-form',
  templateUrl: './shinden-advice-registration-form.component.html',
  styleUrls: ['./shinden-advice-registration-form.component.scss'],
})
export class ShindenAdviceRegistrationFormComponent implements OnInit {
  showingScreen = 'form';
  public patient: any;
  constructor(private router: Router, private registrationService: RegistrationService) {}

  ngOnInit(): void {
    if (!this.registrationService.getCurrentHospital())
      this.router.navigate(['/shinden-registration/shinden-advice/top']);
  }

  /**
   * function when clicking next
   * @param data patient data transfered to next screen
   */
  public onNextClicked(data?: any): void {
    window.scrollTo({ top: 0 });
    if (data) {
      this.patient = data;
    }
    this.showingScreen = 'note';
  }

  /**
   * function when clicking confirm
   * @param data patient data transfered to next screen
   */
  public onConfirmClicked(data?: any): void {
    window.scrollTo({ top: 0 });
    if (data) {
      this.patient = data;
    }
    this.showingScreen = 'confirm';
  }

  /**
   * function when clicking return
   */
  public onReturnClicked(): void {
    window.scrollTo({ top: 0 });
    this.showingScreen = 'form';
  }
}
