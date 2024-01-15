import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthenticationService } from '@services/authentication.service';
import { AppVersionComponent } from '@layout/sidebar/app-version/app-version.component';
import { SharedService } from '@shared/services/shared.service';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() menuList: Array<{
    name: string;
    path: string;
    icon: string;
    class?: string;
    isAlert?: boolean;
    isAnalysisRequest?: boolean;
    iconStyle: { width: number; height: number };
  }> = [];
  @Input() hospitalSettingList: Array<{ name: string; path: string; class?: string }> = [];

  public navbarCollapsed = true;

  constructor(
    private authService: AuthenticationService,
    private modalService: NgbModal,
    public sharedService: SharedService,
    private router: Router
  ) {}

  /**
   * show/hide sidebar
   */
  clickToggle(data?: boolean) {
    if (!data) {
      this.navbarCollapsed = false;
    }
    this.sharedService.closeSidebar = !this.sharedService.closeSidebar;
  }

  /**
   * Call api logout from service
   */
  logout(): void {
    this.router.navigate([this.authService.redirectToLogin()]);

    // unregister service worker when logout
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        if (registration.scope === `${environment.frontend_url}/firebase-cloud-messaging-push-scope`) {
          registration.unregister();
        }
      }
    });
    if (!this.router.url.includes('admin')) {
      location.reload();
    }
    this.authService.signout();
  }

  /**
   * show app version when click OMRON mark
   */
  showAppVersion(): void {
    this.modalService.open(AppVersionComponent, {
      backdrop: 'static',
      modalDialogClass: 'w-280',
    });
  }

  /**
   * Get total data in red circle
   * @param item
   */
  getTotal(item: any) {
    const maxShowTotal = 99;
    let result: string | number = '';

    if (item.isAlert) {
      result = this.sharedService.totalPatientHasAlert;
    } else if (item.isAnalysisRequest) {
      result = this.sharedService.totalPatientAnalysisRequest;
    }

    return result > maxShowTotal ? `${maxShowTotal}+` : result;
  }

  /**
   * Menu show red circle
   * @param item
   */
  showRedCircle(item: any): boolean {
    return (
      (item.isAlert && this.sharedService.totalPatientHasAlert) ||
      (item.isAnalysisRequest && this.sharedService.totalPatientAnalysisRequest)
    );
  }
}
