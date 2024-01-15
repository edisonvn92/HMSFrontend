import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '@data/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import { loginType } from '@shared/helpers/data';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  serverError = false;
  validationError = false;
  public forgotPassForm = this.formBuilder.group({
    username_or_email: [
      '',
      {
        validators: [Validators.required, Validators.maxLength(255)],
        updateOn: 'submit',
      },
    ],
  });

  constructor(
    private authService: AuthenticationService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.sharedService.changeCognitoConfig(loginType.DASHBOARD);
  }

  /**
   * function when click send
   */
  onSubmit() {
    setTimeout(() => {
      // this.error = !this.groupForm.valid;
      if (this.forgotPassForm.valid) {
        this.serverError = false;
        this.validationError = false;
        this.authService
          .sendForgotPasswordEmail(this.usernameOrEmail.value.trim(), false)
          .then(() => {
            this.sharedService.showLoadingEventEmitter.emit(false);
            this.toastService.show(this.translate.instant('email sent'), { className: 'bg-green-200' });
            this.router.navigate(['auth/password-setting']);
          })
          .catch(() => {
            this.sharedService.showLoadingEventEmitter.emit(false);
            this.serverError = true;
          });
      } else {
        this.validationError = true;
      }
    }, 10);
  }

  get usernameOrEmail() {
    return this.forgotPassForm.get('username_or_email')!;
  }
}
