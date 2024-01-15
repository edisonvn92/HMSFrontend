import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms-of-use',
  templateUrl: './terms-of-use.component.html',
  styleUrls: ['./terms-of-use.component.scss'],
})
export class TermsOfUseComponent implements OnInit {
  public omronTermOfUseLink = 'https://www.omronconnect.com/eula/tw/zh_tw/';
  public omronPrivacyLink = 'https://www.omronconnect.com/privacy/tw/zh_tw/';

  constructor() {}

  ngOnInit(): void {}
}
