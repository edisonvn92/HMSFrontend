import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient, HttpBackend } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '@env/environment';

import { AppRoutingModule } from './app-routing.module';
import { LayoutsModule } from '@layout/layouts.module';

import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';

import { ApiInterceptor } from '@core/interceptor/api.interceptor';
import { AppComponent } from './app.component';
import { ToastComponent } from '@shared/components/toast/toast.component';

import { NgIdleModule } from '@ng-idle/core';

import { AngularDraggableModule } from 'angular2-draggable';

@NgModule({
  declarations: [AppComponent, ToastComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutsModule,
    HttpClientModule,
    NgbModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpBackend],
      },
    }),
    NgIdleModule.forRoot(),
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp({
      apiKey: environment.firebase_api_key,
      authDomain: environment.firebase_auth_domain,
      projectId: environment.firebase_project_id,
      storageBucket: environment.firebase_storage_bucket,
      messagingSenderId: environment.firebase_messaging_sender_id,
      appId: environment.firebase_app_id,
    }),
    AngularDraggableModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}

// AOT compilation support
export function httpTranslateLoader(httpBackend: HttpBackend): TranslateHttpLoader {
  return new TranslateHttpLoader(new HttpClient(httpBackend));
}
