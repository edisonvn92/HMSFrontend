import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '@data/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { role } from '@shared/helpers/data';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import BaseValidators from '@shared/validators/base.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  showCurrentPassword = false;
  showNewPassword = false;
  showRetypePassword = false;
  serverError = false;
  serverErrorMessage = '';
  validationError = false;
  userRole = '';
  role = role;
  public changePasswordForm = this.formBuilder.group(
    {
      current_password: [
        '',
        {
          validators: [Validators.required],
          updateOn: 'submit',
        },
      ],
      new_password: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(8),
            BaseValidators.checkPasswordValidCharacter,
            BaseValidators.passwordRules,
          ],
          updateOn: 'submit',
        },
      ],
      confirm_password: [
        '',
        {
          validators: [Validators.required],
          updateOn: 'submit',
        },
      ],
    },
    {
      validators: [BaseValidators.passwordMatch('new_password', 'confirm_password')],
    }
  );

  constructor(
    private authService: AuthenticationService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getCurrentUserRoles()[0];
  }

  /**
   * function when click password change
   */
  onSubmit() {
    setTimeout(() => {
      this.serverError = false;
      this.validationError = false;
      if (this.changePasswordForm.valid) {
        this.authService
          .changePassword(this.currentPassword.value, this.newPassword.value)
          .then(() => {
            this.sharedService.showLoadingEventEmitter.emit(false);
            this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
            if (this.userRole === role.hospital) {
              this.router.navigate(['hospital/home']);
            } else {
              this.router.navigate(['/doctor/patient']);
            }
          })
          .catch((error) => {
            this.sharedService.showLoadingEventEmitter.emit(false);
            this.serverError = true;
            if (error.code !== 'NotAuthorizedException') {
              this.serverErrorMessage = error.message;
            }
          });
      } else {
        this.validationError = true;
      }
    }, 10);
  }

  get currentPassword() {
    return this.changePasswordForm.get('current_password')!;
  }

  get newPassword() {
    return this.changePasswordForm.get('new_password')!;
  }

  get confirmPassword() {
    return this.changePasswordForm.get('confirm_password')!;
  }
}
