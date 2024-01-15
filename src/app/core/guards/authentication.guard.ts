import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthenticationService } from '@data/services/authentication.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {}
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // check if it's authenticated or it is not expired
    if (this.authService.isAuthenticated().value && this.authService.getExpiringTime() > new Date()) {
      return true;
    } else {
      this.authService.signout();
      this.router.navigate(['/auth/login']);
      location.reload();
      return false;
    }
  }
}
