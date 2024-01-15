import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@services/authentication.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { role } from '@shared/helpers/data';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit {
  public currentRoles: string[] = [];
  public subscriptions: Subscription = new Subscription();
  public role = role;

  constructor(private authService: AuthenticationService, private location: Location) {}

  ngOnInit() {
    this.currentRoles = this.authService.getCurrentUserRoles();
  }

  /**
   * Handle event when click go to previous page
   */
  goBack() {
    this.location.back();
  }
}
