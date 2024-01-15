import { Component, OnInit } from '@angular/core';
import { adminMenuList } from '@shared/helpers/data';
import { SharedService } from '@shared/services/shared.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/authentication.service';
import { joinName } from '@shared/helpers';

@Component({
  selector: 'app-admin-content',
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.scss'],
})
export class AdminContentComponent implements OnInit {
  public adminMenuList = adminMenuList;
  public currentUser: any = {};
  public joinName = joinName;

  constructor(public sharedService: SharedService, private router: Router, public authService: AuthenticationService) {}

  ngOnInit(): void {
    const authInfo = this.authService.getCurrentUserInfo();
    if (!authInfo) {
      this.authService.getCurrentAdmin().subscribe(
        (user: any) => {
          this.currentUser = user;
          this.authService.setUserInfo(user);
          this.sharedService.showLoadingEventEmitter.emit(false);
        },
        () => {
          this.sharedService.showLoadingEventEmitter.emit(false);
        }
      );
    } else {
      this.currentUser = authInfo;
    }
  }

  /**
   * go to change password
   */
  goToChangePassword() {
    this.router.navigate(['admin/change-password']);
  }
}
