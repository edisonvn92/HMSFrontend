import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-help-detail-2',
  templateUrl: './help-detail-2.component.html',
  styleUrls: ['./help-detail-2.component.scss'],
})
export class HelpDetail2Component {
  public evaluations = [
    { star: 4, text: 'i was able to do it' },
    { star: 3, text: 'did it' },
    { star: 2, text: 'i did a little' },
    { star: 1, text: "i couldn't do much" },
    { star: 0, text: 'unanswered' },
  ];
  public bloodPressures = [
    {
      icon: './assets/images/blood_pressure_3.svg',
      text: 'achieved the target blood pressure value',
    },
    {
      icon: './assets/images/blood_pressure_2.svg',
      text: 'same as the target blood pressure value somewhat expensive',
    },
    {
      icon: './assets/images/blood_pressure_1.svg',
      text: 'higher than the target blood pressure value',
    },
    {
      icon: './assets/images/blood_pressure_0.svg',
      text: 'very high above the target blood pressure',
    },
  ];
  public measurementStatus = [
    {
      icon: './assets/images/icon_heart_1.svg',
      text1: 'patient.irregular pulse wave',
      text2: 'the pulse during measurement is not detected properly',
    },
    {
      icon: './assets/images/icon_body_1.svg',
      text1: 'with body movement',
      text2: 'i talked or moved during the measurement',
    },
    {
      icon: './assets/images/cuff_winding_1.svg',
      text1: 'cuff winding NG',
      text2: 'the cuff is not wrapped with the proper strength',
    },
  ];
  public lifeImprovements = [
    {
      icon: './assets/images/icon_exercise.svg',
      text: 'motion',
      border_bottom: true,
    },
    {
      icon: './assets/images/icon_vegetable_intake.svg',
      text: 'vegetable intake',
      border_bottom: true,
      border_left: true,
    },
    {
      icon: './assets/images/icon_sleep.svg',
      text: 'sleep',
      border_bottom: true,
      border_left: true,
    },
    {
      icon: './assets/images/icon_reduced_salt.svg',
      text: 'reduced salt',
      border_bottom: true,
      border_left: true,
    },
    {
      icon: './assets/images/icon_saving_sake.svg',
      text: 'sobriety',
      border_bottom: true,
      border_left: true,
    },
    {
      icon: './assets/images/icon_smoking.svg',
      text: 'no smoking',
      border_bottom: true,
      border_left: true,
    },
    {
      icon: './assets/images/icon_lack_of_exercise.svg',
      text: 'lack of exercise',
    },
    {
      icon: './assets/images/icon_lack_of_vegetables.svg',
      text: 'lack of vegetables',
      border_left: true,
    },
    {
      icon: './assets/images/icon_lack_of_sleep.svg',
      text: 'lack of sleep',
      border_left: true,
    },
    {
      icon: './assets/images/icon_salt.svg',
      text: 'salt',
      border_left: true,
    },
    {
      icon: './assets/images/icon_alcohol.svg',
      text: 'alcohol',
      border_left: true,
    },
    {
      icon: './assets/images/icon_smoking_1.svg',
      text: 'smoking',
      border_left: true,
    },
  ];

  public other = [
    {
      icon: './assets/images/icon_memo_event.svg',
      text: 'there is a patient memo',
    },
    {
      icon: './assets/images/ic_report_purple.svg',
      text: 'report',
    },
    {
      icon: './assets/images/ic_mail_purple.svg',
      text: 'mail sent',
    },
  ];

  constructor(public activeModal: NgbActiveModal, public sharedService: SharedService) {}

  /**
   * handle when close button is clicked
   */
  public clickedClose(): void {
    this.activeModal.close('Notify click');
  }
}
