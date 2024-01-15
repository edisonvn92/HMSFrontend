import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UUID } from 'angular2-uuid';
import { StorageService } from '@shared/services/storage.service';
import { FirebaseService } from '@services/firebase.service';
import { deviceTypeSendNotification, role } from '@shared/helpers/data';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  deviceUuid: string = '';

  constructor(
    private angularFireMessaging: AngularFireMessaging,
    private storageService: StorageService,
    private firebaseService: FirebaseService,
    public sharedService: SharedService,
    private toastService: ToastService
  ) {}

  /**
   * get device uuid from localStorage or random if not have
   */
  getDeviceUuid() {
    this.deviceUuid = this.storageService.getFromLocal('deviceUuid');
    if (!this.deviceUuid) {
      this.deviceUuid = UUID.UUID();
      this.storageService.setToLocal('deviceUuid', this.deviceUuid);
    }
  }

  /**
   * delete token to unsubscribe from firebase console messaging
   */
  deleteFirebaseToken() {
    const deviceUuid = this.storageService.getFromLocal('deviceUuid');
    if (deviceUuid) {
      this.firebaseService
        .deleteToken({ device_id: deviceUuid, device_type: deviceTypeSendNotification.WEB })
        .subscribe(
          () => {
            this.storageService.removeFromLocal('notificationToken');
          },
          () => {
            this.toastService.show('', { className: 'd-none' });
          }
        );
    }
  }

  /**
   * delete token from database
   */
  deleteToken(): Observable<boolean> {
    const notificationToken = this.storageService.getFromLocal('notificationToken');
    if (notificationToken) {
      return this.angularFireMessaging.deleteToken(notificationToken);
    }

    return of(false);
  }

  /**
   * request permission for notification
   */
  requestPermission() {
    const userInfo = this.storageService.getFromLocal('userInfo');
    if (
      userInfo &&
      userInfo.roles &&
      (userInfo.roles.includes(role.doctor) || userInfo.roles.includes(role.nurse)) &&
      userInfo.hospital?.hospital_setting?.hospital_setting_register_notification
    ) {
      this.angularFireMessaging.requestPermission.subscribe(async (permission: any) => {
        if (permission && permission !== 'denied') {
          this.getDeviceUuid();

          this.angularFireMessaging.requestToken.subscribe(
            (token: any) => {
              if (token) {
                this.storageService.setToLocal('notificationToken', token);
                this.firebaseService
                  .saveToken({
                    device_id: this.deviceUuid,
                    device_token: token,
                    device_type: deviceTypeSendNotification.WEB,
                  })
                  .subscribe(
                    () => {},
                    () => {}
                  );
              }
            },
            () => {}
          );
        }
      });
    }
  }

  /**
   * request token
   */
  requestToken() {
    // delete token before request new token
    this.angularFireMessaging.getToken.subscribe(async (token: any) => {
      if (token) {
        this.angularFireMessaging.deleteToken(token).subscribe(async (data) => {
          if (data) {
            await this.deleteFirebaseToken();
          }
          this.requestPermission();
        });
      } else {
        this.requestPermission();
      }
    });
  }

  /**
   * delete token subscribed token firebase (only roles not includes doctor/nurse)
   */
  deleteSubscribedTokenFirebase() {
    this.angularFireMessaging.getToken.subscribe((token: any) => {
      if (token) {
        this.angularFireMessaging.deleteToken(token).subscribe(() => {});
      }
    });
  }
}
