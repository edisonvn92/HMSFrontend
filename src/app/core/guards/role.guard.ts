import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthenticationService } from '@data/services/authentication.service';
import { role } from '@shared/helpers/data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const expectedRoles: any[] = route.data.expectedRole;
    let currentRoles: string[] = this.authService.getCurrentUserRoles();
    if (
      expectedRoles &&
      expectedRoles.length >= 0 &&
      currentRoles &&
      currentRoles.length >= 0 &&
      expectedRoles.some((r) => currentRoles.indexOf(r) >= 0)
    ) {
      return true;
    } else if (currentRoles && currentRoles.includes(role.system_admin)) {
      this.router.navigate(['/admin/hospital']);
    } else if (currentRoles && currentRoles.includes(role.hospital)) {
      this.router.navigate(['/hospital/home']);
    } else if (currentRoles && (currentRoles.includes(role.doctor) || currentRoles.includes(role.nurse))) {
      this.router.navigate(['/doctor/patient']);
    }
    return false;
  }
}
