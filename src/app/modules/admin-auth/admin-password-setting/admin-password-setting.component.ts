import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '@data/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import BaseValidators from '@shared/validators/base.validator';
import { loginType } from '@shared/helpers/data';
import { StorageService } from '@shared/services/storage.service';

@Component({
  selector: 'app-admin-password-setting',
  templateUrl: './admin-password-setting.component.html',
  styleUrls: ['./admin-password-setting.component.scss'],
})
export class AdminPasswordSettingComponent implements OnInit {
  showPassword = false;
  showRetypePassword = false;
  serverError = false;
  serverErrorMessage = '';
  validationError = false;
  public passwordSettingForm = this.formBuilder.group(
    {
      password: [
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
      retype_password: [
        '',
        {
          validators: [Validators.required],
          updateOn: 'submit',
        },
      ],
      reset_code: [
        '',
        {
          validators: [Validators.required],
          updateOn: 'submit',
        },
      ],
    },
    {
      validators: [BaseValidators.passwordMatch('password', 'retype_password')],
    }
  );

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private translate: TranslateService,
    private storageService: StorageService,
    public sharedService: SharedService
  ) {}

  ngOnInit() {
    this.sharedService.changeCognitoConfig(loginType.ADMIN);
    if (!this.storageService.getFromLocal('usernameOrEmailAdmin')) {
      this.router.navigate(['/admin/auth/forgot-password']);
    }
  }

  /**
   * function when click Save
   */
  onSubmit() {
    setTimeout(() => {
      if (this.passwordSettingForm.valid) {
        this.serverError = false;
        this.validationError = false;
        this.authService
          .resetPassword(this.password.value, this.resetCode.value, true)
          .then(() => {
            this.sharedService.showLoadingEventEmitter.emit(false);
            this.storageService.removeFromLocal('usernameOrEmailAdmin');
            this.toastService.show(this.translate.instant('saved'), { className: 'bg-green-200' });
            this.router.navigate(['/admin/auth/login']);
          })
          .catch((error) => {
            this.sharedService.showLoadingEventEmitter.emit(false);
            this.serverError = true;
            this.serverErrorMessage = error.message;
          });
      } else {
        this.validationError = true;
      }
    }, 10);
  }

  get password() {
    return this.passwordSettingForm.get('password')!;
  }

  get retypePassword() {
    return this.passwordSettingForm.get('retype_password')!;
  }

  get resetCode() {
    return this.passwordSettingForm.get('reset_code')!;
  }
}
