import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';
import { SharedService } from '@shared/services/shared.service';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { AuthenticationService } from '@data/services/authentication.service';
import { expiringTimeInSecond, role } from '@shared/helpers/data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Amplify from '@aws-amplify/core';
import awsConfig from 'aws-exports';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'frontend';
  public showLoading = false;
  public isWebView = false;
  public langs = ['en', 'ja', 'zh_CN', 'zh_TW'];
  public defaultAppLanguage = 'zh_TW';

  constructor(
    public translate: TranslateService,
    private router: Router,
    public sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private idle: Idle,
    private modalService: NgbModal
  ) {
    const langBrowser = translate.getBrowserLang();
    translate.addLangs(this.langs);
    translate.setDefaultLang(langBrowser === 'ja' ? 'ja' : 'en');
    translate.use(langBrowser === 'ja' ? 'ja' : 'en');

    // set up idle config
    idle.setIdle(1);
    idle.setTimeout(expiringTimeInSecond);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    idle.onIdleEnd.subscribe(() => {
      this.authService.setExpiringTime(new Date().getTime() + expiringTimeInSecond * 1000);
      cdr.detectChanges();
    });
    idle.onTimeout.subscribe(() => {
      this.authService.signout();
      this.router.navigate([this.authService.redirectToLogin()]).then(() => {
        window.location.reload();
      });
    });
  }

  ngOnInit(): void {
    const currentRoles: string[] = this.authService.getCurrentUserRoles();
    if (currentRoles && currentRoles.includes(role.system_admin)) {
      Amplify.configure(awsConfig.awsConfigAdmin);
    } else {
      Amplify.configure(awsConfig.awsConfigDashboard);
    }

    this.sharedService.cognitoSubject.subscribe((data) => {
      Amplify.configure(data);
    });

    /* Scroll to top page when changing page */
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }

      window.scrollTo(0, 0);
      this.modalService.dismissAll();
    });
    this.sharedService.showLoadingEventEmitter.subscribe((showLoading: boolean) => {
      this.showLoading = showLoading;
      this.cdr.detectChanges();
    });

    const appTitle = this.titleService.getTitle();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          const child = this.activatedRoute.firstChild;
          if (child && child.snapshot.routeConfig?.path === 'admin') {
            this.translate.use('ja');
          }

          if (child && child.snapshot.data['title']) {
            return child.snapshot.data['title'];
          }
          if (child && child?.snapshot?.firstChild?.data['title']) {
            return child.snapshot.firstChild.data['title'];
          }
          if (child && child?.snapshot?.firstChild?.firstChild?.data['title']) {
            return child?.snapshot?.firstChild?.firstChild?.data['title'];
          }
          this.isWebView = child?.snapshot.data['isWebview'];
          if (this.isWebView) {
            let lang = this.activatedRoute.snapshot.queryParamMap.get('lang') || '';
            lang = lang.slice(0, 2) === 'zh' ? lang : lang.slice(0, 2);
            if (this.langs.includes(lang)) {
              this.translate.use(lang);
            } else {
              this.translate.use(this.defaultAppLanguage);
            }
          }

          return appTitle;
        })
      )
      .subscribe((appTitle: string) => {
        this.translate.get(appTitle).subscribe((translated: string) => {
          this.titleService.setTitle(translated);
        });
      });

    this.idle.watch();
  }
}
