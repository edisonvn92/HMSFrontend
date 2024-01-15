import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthenticationService } from '@data/services/authentication.service';
import { role } from '@shared/helpers/data';
import { SharedService } from '@shared/services/shared.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotLoggedGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private sharedService: SharedService
  ) {}
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // check if it's not authenticated or it is expired
    if (!this.authService.isAuthenticated().value || this.authService.getExpiringTime() < new Date()) {
      this.authService.signout();
      return true;
    } else {
      let currentRoles = this.authService.getCurrentUserRoles();
      if (currentRoles.includes(role.system_admin)) {
        this.authService.getCurrentAdmin().subscribe(() => {
          this.sharedService.showLoadingEventEmitter.emit(false);
          this.authService.setUserRoles([role.system_admin]);
          this.router.navigate(['/admin/hospital']);
        });
      } else {
        this.authService.getCurrentUser().subscribe((user: any) => {
          this.sharedService.showLoadingEventEmitter.emit(false);
          this.authService.setUserRoles(user.roles);
          if (user.roles.includes(role.hospital)) {
            this.router.navigate(['/hospital/home']);
          } else if (user.roles.includes(role.doctor) || user.roles.includes(role.nurse)) {
            this.router.navigate(['/doctor/patient']);
          }
        });
      }
    }
    return false;
  }
}
