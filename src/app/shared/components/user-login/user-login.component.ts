import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '@services/authentication.service';
import { SharedService } from '@shared/services/shared.service';
import { ILoginUser } from '@models/loginUser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelpDetail1Component } from '../help-component/help-detail-1/help-detail-1.component';
import { joinName } from '@shared/helpers';
import { HelpDetailErrorComponent } from '../help-component/help-detail-error/help-detail-error.component';
import { HelpDetail2Component } from '../help-component/help-detail-2/help-detail-2.component';
import { Location } from '@angular/common';
import { role } from '@shared/helpers/data';
import { ExportModalComponent } from '../export-modal/export-modal.component';
import { HelpDetail3Component } from '../help-component/help-detail-3/help-detail-3.component';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {
  @Input() arrIcon: Array<string> = [];
  @Input() latestDataSync!: string;
  @Input() groupId = 0;

  public currentUser: any = {};
  public joinName = joinName;
  private helpComponent = [HelpDetailErrorComponent, HelpDetail1Component, HelpDetail2Component, HelpDetail3Component];
  private modalWidthJa = ['w-912', 'w-912', 'w-528', 'w-494'];
  private modalWidthEn = ['w-912', 'w-912', 'w-528', 'w-652'];

  constructor(
    public authService: AuthenticationService,
    public sharedService: SharedService,
    private router: Router,
    private modalService: NgbModal,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const authInfo = this.authService.getCurrentUserInfo();
    if (!authInfo) {
      this.sharedService.showLoadingEventEmitter.emit(false);
      this.authService.getCurrentUser().subscribe((user: ILoginUser) => {
        this.currentUser = user;
        this.authService.setUserInfo(user);
        this.sharedService.showLoadingEventEmitter.emit(false);
      });
    } else {
      this.currentUser = this.authService.getCurrentUserInfo();
    }
  }

  /**
   * handle when help button is clicked
   */
  clickedHelp() {
    let type = this.sharedService.hospitalSetting?.hospital_setting?.hospital_setting_help_type
      ? this.sharedService.hospitalSetting.hospital_setting.hospital_setting_help_type
      : 0;

    type = type < this.helpComponent.length ? type : 0;

    this.modalService.open(this.helpComponent[type], {
      backdrop: 'static',
      modalDialogClass: `${this.sharedService.isJa() ? this.modalWidthJa[type] : this.modalWidthEn[type]}`,
    });
  }

  /**
   * handle when reload button is clicked
   */
  clickedReload() {
    this.sharedService.refreshData();
  }

  /**
   * function when click export data
   */
  clickedExport() {
    const modalRef = this.modalService.open(ExportModalComponent, {
      backdrop: 'static',
      size: 'lg',
      modalDialogClass: 'w-552',
    });
    modalRef.componentInstance.patientId = this.route.snapshot.paramMap.get('id') || '';
    modalRef.componentInstance.groupId = this.groupId;
  }

  /**
   * function when click change password
   */
  goToChangePassword() {
    let roles = this.authService.getCurrentUserRoles();
    if (roles.includes(role.hospital)) {
      this.router.navigate(['hospital/change-password']);
    } else {
      this.router.navigate(['doctor/change-password']);
    }
  }

  /**
   * Handle event when click go to previous page
   */
  goBack() {
    this.location.back();
  }
}
