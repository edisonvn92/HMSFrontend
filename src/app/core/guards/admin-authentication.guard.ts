import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthenticationGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // check if it's authenticated or it is not expired
    if (this.authService.isAuthenticated().value && this.authService.getExpiringTime() > new Date()) {
      return true;
    } else {
      this.authService.signout();
      this.router.navigate(['/admin/auth/login']);
      location.reload();
      return false;
    }
  }
}
