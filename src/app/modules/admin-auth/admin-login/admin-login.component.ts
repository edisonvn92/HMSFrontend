import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '@data/services/authentication.service';
import { SharedService } from '@shared/services/shared.service';
import { CookieService } from 'ngx-cookie-service';
import { loginType, role } from '@shared/helpers/data';
import { throwError } from 'rxjs';
import { MessagingService } from '@shared/services/messaging.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent implements OnInit {
  showPassword = false;
  incorrectPwError = false;
  userExpiredError = false;
  otherError = false;
  errorMessage = '';
  rememberUsername = true;
  clickSubmit = false;
  username: string = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    public sharedService: SharedService,
    private cookieService: CookieService,
    private messagingService: MessagingService
  ) {}

  ngOnInit() {
    this.sharedService.changeCognitoConfig(loginType.ADMIN);
    this.rememberUsername = this.authService.getRememberUsername();
    if (this.rememberUsername) this.username = this.cookieService.get('username');
  }

  /**
   * Function for when click login
   * @param f ngForm
   */
  onSubmit(f: NgForm): void {
    if (this.clickSubmit) {
      return;
    }
    this.errorMessage = '';
    this.otherError = false;
    this.clickSubmit = true;
    this.userExpiredError = false;
    this.incorrectPwError = false;
    const loginValue = f.value;
    loginValue.username = loginValue.username.trim().toLowerCase();
    this.authService.setRememberUsername(this.rememberUsername.toString());
    this.authService.signin(loginValue).then(
      () => {
        this.authService.getCurrentAdmin().subscribe(
          (user: any) => {
            if (loginValue.username !== user.admin_cognito_username.toLowerCase()) {
              this.authService.signout();
              this.sharedService.showLoadingEventEmitter.emit(false);
              this.incorrectPwError = true;
              this.clickSubmit = false;
            } else {
              this.authService.setUserRoles([role.system_admin]);
              this.authService.setUserInfo({ ...user, roles: [role.system_admin] });
              this.messagingService.deleteSubscribedTokenFirebase();
              this.sharedService.showLoadingEventEmitter.emit(false); // TODO remove when call API hospital list
              this.router.navigate(['/admin/hospital']);
            }
          },
          (error: any) => {
            this.authService.signout();
            this.sharedService.showLoadingEventEmitter.emit(false);
            this.clickSubmit = false;
            if (error.status == 403 || error.status == 404) {
              this.userExpiredError = true;
              this.clickSubmit = false;
            } else {
              this.errorMessage = error.message;
              this.otherError = true;
            }
            return throwError(error);
          }
        );
      },
      (error: any) => {
        this.sharedService.showLoadingEventEmitter.emit(false);
        if (error.status == 401 || error.status == 400) {
          this.incorrectPwError = true;
          this.clickSubmit = false;
        } else if (error.status == 403) {
          this.userExpiredError = true;
          this.clickSubmit = false;
        } else {
          if (error.message.includes('userName') && error.message.includes('pattern')) {
            this.incorrectPwError = true;
          } else {
            this.otherError = true;
            this.errorMessage = error.message;
          }
          this.clickSubmit = false;
        }
      }
    );
  }
}
