import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';

import { StorageService } from '@shared/services/storage.service';
import { ILoginUser } from '@models/loginUser';
import Auth from '@aws-amplify/auth';
import { SharedService } from '@shared/services/shared.service';
import { CookieService } from 'ngx-cookie-service';
import { Idle } from '@ng-idle/core';
import { expiringTimeInSecond } from '@shared/helpers/data';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUser: ILoginUser | any = {};
  private roles: string[] = [];
  private expiredTime: number = 0;
  private tokenExpiringTime = (3600 * 1000) / 2;
  private rememberUsername: string | null = 'true';

  constructor(
    private storageService: StorageService,
    private sharedService: SharedService,
    private http: HttpClient,
    private cookieService: CookieService,
    private idle: Idle,
    private router: Router
  ) {}

  /**
   * Return whether the user is signed in or not
   * @returns value true or false in Observable form
   */
  isAuthenticated(): BehaviorSubject<boolean> {
    return new BehaviorSubject(this.getIdToken() != null);
  }

  /**
   * get token from storage
   * @private
   */
  private getIdToken(): any {
    return this.storageService.getFromLocal(this.storageService.ID_TOKEN_KEY);
  }

  /**
   * get user Cognito id
   * @returns cognito id
   */
  geCurrentUserCognitoSub(): string {
    return this.currentUser.hcp_cognito_sub;
  }

  /**
   * Get the doctor profile currently signed in
   * @returns Doctor profile in observable
   */
  getCurrentUser(): Observable<any> {
    return this.http.post('/dashboard/auth/info', {});
  }

  /**
   * Get the doctor profile currently signed in
   * @returns Doctor profile in observable
   */
  getCurrentAdmin(): Observable<any> {
    return this.http.post('/admin/auth/info', {});
  }

  /**
   * get the current user's role
   * @returns role of the current user
   */
  getCurrentUserRoles(): string[] {
    return this.storageService.getFromLocal('userRole');
  }

  /**
   * Set role for signing user, starting at login page
   * @param roles role of user: hospital, doctor, nurse, patient
   */
  setUserRoles(roles: string[]): void {
    this.roles = roles;
    this.storageService.setToLocal('userRole', this.roles);
    // after this part need to initiate Amplify again
  }

  /**
   * Set info for signing user, starting at sidebar
   * @param currenUser: user login
   */
  setUserInfo(currenUser: any): void {
    this.storageService.setToLocal('userInfo', {
      hcp_last_name: currenUser.hcp_last_name,
      hcp_middle_name: currenUser.hcp_middle_name,
      hcp_first_name: currenUser.hcp_first_name,
      hospital: currenUser.hospital,
      groups: currenUser.groups,
      hcp_id: currenUser.hcp_id,
      roles: currenUser.roles,
      admin_cognito_username: currenUser.admin_cognito_username,
      admin_first_name: currenUser.admin_first_name,
      admin_middle_name: currenUser.admin_middle_name,
      admin_last_name: currenUser.admin_last_name,
    });
  }

  /**
   * get the current user's role
   * @returns info of the current user
   */
  getCurrentUserInfo(): any {
    return this.storageService.getFromLocal('userInfo');
  }

  /**
   * set expiring time when login or returning back to active
   * @param expired expiring time in msec
   */
  setExpiringTime(expired: number): void {
    this.expiredTime = expired;
    this.storageService.setToLocal('expiringTime', this.expiredTime);
  }

  /**
   * return current expiring time
   * @returns expiring time in Date
   */
  getExpiringTime(): Date {
    if (this.storageService.getFromLocal('expiringTime'))
      this.expiredTime = Number(this.storageService.getFromLocal('expiringTime'));
    return new Date(this.expiredTime);
  }

  /**
   * set remember username (true or false)
   * @param rememberUsername remember username value
   */
  setRememberUsername(rememberUsername: string): void {
    this.rememberUsername = rememberUsername;
    this.storageService.setToLocal('rememberUsername', rememberUsername);
  }

  /**
   * get remember username value saved
   * @returns remmember username value in boolean
   */
  getRememberUsername(): boolean {
    if (this.storageService.getFromLocal('rememberUsername'))
      this.rememberUsername = this.storageService.getFromLocal('rememberUsername');
    return this.rememberUsername == null ? true : this.rememberUsername == 'true';
  }

  /**
   * Sign in the Dashboard
   * @param input userid and password sent in object
   * @returns profile of doctor if successfully signed in
   */
  async signin(input: { username: string; password: string }): Promise<any> {
    try {
      let currentUser = { signInUserSession: {} };
      this.sharedService.showLoadingEventEmitter.emit(true);
      await Auth.signIn(input.username, input.password).then((user: any) => {
        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          Auth.completeNewPassword(user, input.password)
            .then((user: any) => {
              currentUser = user;
            })
            .catch(() => {});
        } else {
          currentUser = user;
        }
        this.setDataLogin(currentUser.signInUserSession);
        this.saveUsernameToCookie(input.username);
        return currentUser;
      });
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * save username to cookie
   * @param username username string
   */
  saveUsernameToCookie(username: string) {
    // set expiring time to 1 week;
    let expiringTime = new Date().getTime() + 1000 * 3600 * 24 * 7;
    this.cookieService.deleteAll();
    if (this.getRememberUsername()) {
      this.cookieService.set('username', username, new Date(expiringTime), '/', undefined, true);
      this.cookieService.set('username', username, new Date(expiringTime), this.redirectToLogin(), undefined, true);
    }
  }

  /**
   * Set persist data after login successfully
   * @param user: contain token data
   */
  setDataLogin(user: any): void {
    this.storageService.setToLocal(this.storageService.ACCESS_TOKEN_KEY, user.accessToken.jwtToken);
    this.storageService.setToLocal(this.storageService.ID_TOKEN_KEY, user.idToken.jwtToken);
    this.storageService.setToLocal(this.storageService.REFRESH_TOKEN_KEY, user.refreshToken.token);
    this.setExpiringTime(new Date().getTime() + this.tokenExpiringTime);
    this.idle.watch();
  }

  /**
   * Sign out of the dashboard
   * @returns any
   */
  signout(): Observable<boolean> {
    this.currentUser = {};
    this.storageService.removeTokenData();
    this.storageService.removeFromLocal('userInfo');
    this.storageService.removeFromLocal('userRole');
    this.sharedService.closeSidebar = true;
    this.sharedService.hospitalSetting = {};
    this.sharedService.totalPatientHasAlert = 0;
    this.sharedService.totalPatientAnalysisRequest = 0;
    this.sharedService.clickReload = false;
    this.sharedService.selectedGroupId = 0;
    Auth.signOut();
    return of(true);
  }

  /**
   * Refresh token by cognito
   */
  async refreshToken(): Promise<unknown> {
    this.setExpiringTime(new Date().getTime() + expiringTimeInSecond * 1000);
    this.idle.watch();
    return Auth.currentSession();
  }

  /**
   * send reset code email to the required email
   * @param usernameOrEmail username or email
   * @param isAdmin check this function is used in system admin or not
   */
  async sendForgotPasswordEmail(usernameOrEmail: string, isAdmin: boolean): Promise<any> {
    if (isAdmin) this.storageService.setToLocal('usernameOrEmailAdmin', usernameOrEmail);
    else this.storageService.setToLocal('usernameOrEmail', usernameOrEmail);
    try {
      this.sharedService.showLoadingEventEmitter.emit(true);
      await Auth.forgotPassword(usernameOrEmail).then((user: any) => {
        return user;
      });
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Reset password for the current email
   * @param newPassword new password
   * @param resetCode reset code sent to email
   * @param isAdmin check this function is used in system admin or not
   */
  async resetPassword(newPassword: string, resetCode: string, isAdmin: boolean): Promise<any> {
    let usernameOrEmail = '';
    if (isAdmin) usernameOrEmail = this.storageService.getFromLocal('usernameOrEmailAdmin');
    else usernameOrEmail = this.storageService.getFromLocal('usernameOrEmail');
    try {
      this.sharedService.showLoadingEventEmitter.emit(true);
      await Auth.forgotPasswordSubmit(usernameOrEmail, resetCode, newPassword).then((user: any) => user);
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Change password of current user
   * @param currentPassword current password
   * @param newPassword new password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<any> {
    this.sharedService.showLoadingEventEmitter.emit(true);
    await Auth.currentAuthenticatedUser()
      .then((user) => {
        return Auth.changePassword(user, currentPassword, newPassword);
      })
      .then((data) => data)
      .catch((err) => {
        throw err;
      });
  }

  /**
   * redirect to login page follow role
   */
  redirectToLogin(): string {
    return this.router.url.includes('admin') ? '/admin/auth/login' : '/auth/login';
  }
}
