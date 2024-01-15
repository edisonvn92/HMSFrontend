import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'app-shinden-advice-registration-complete',
  templateUrl: './shinden-advice-registration-complete.component.html',
  styleUrls: ['./shinden-advice-registration-complete.component.scss'],
})
export class ShindenAdviceRegistrationCompleteComponent implements OnInit {
  hospitalCode: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.hospitalCode = this.route.snapshot.queryParams['hospital_code'];
  }

  onClicked() {
    window.location.href = `${environment.omron_connect_purchase_link}`;
  }
}
