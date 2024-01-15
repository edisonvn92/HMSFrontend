import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentService } from '@data/services/admin/component.service';
import { HospitalService } from '@data/services/admin/hospital.service';
import { TranslateService } from '@ngx-translate/core';
import { scrollIntoView } from '@shared/helpers';
import { SharedService } from '@shared/services/shared.service';
import { ToastService } from '@shared/services/toast.service';
import { forkJoin } from 'rxjs';
import { BasicInfoComponent } from './components/basic-info/basic-info.component';
import { ComponentSettingComponent } from './components/component-setting/component-setting.component';
import { HospitalSettingComponent } from './components/hospital-setting/hospital-setting.component';
import { MailTemplateComponent } from './components/mail-template/mail-template.component';

@Component({
  selector: 'app-create-hospital',
  templateUrl: './create-hospital.component.html',
  styleUrls: ['./create-hospital.component.scss'],
})
export class CreateHospitalComponent implements OnInit {
  @ViewChild('basicInfo') basicInfo!: BasicInfoComponent;
  @ViewChild('component') component!: ComponentSettingComponent;
  @ViewChild('setting') hospitalSetting!: HospitalSettingComponent;
  @ViewChild('mailTemplate') mailTemplate!: MailTemplateComponent;

  public isSubmitted = false;
  public isCreate = true;
  public error = '';
  public mailSetting: any = {};
  public data: any;
  public components: any;
  public hospitalId: any;
  public componentOrder: any = {};
  public alertFunction = ['WEIGHT', 'BP', 'AF', 'IHB'];
  public lang: any = { en: 'en', ja: 'ja', zh_CN: 'zh-cn', zh_TW: 'zh-tw' };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private hospitalService: HospitalService,
    public sharedService: SharedService,
    private componentService: ComponentService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const hospitalID = this.route.snapshot.queryParams['hospital_id'];
    this.isCreate = !hospitalID;
    this.hospitalId = hospitalID;
    let maxOrder = 0;
    if (hospitalID) {
      forkJoin({
        hospital: this.hospitalService.find({ hospital_id: hospitalID }),
        component: this.componentService.findMany({}),
      }).subscribe(
        (data) => {
          this.data = data.hospital;
          this.components = data.component;
          if (this.data.hospital_dashboards && this.data.hospital_dashboards.length) {
            this.data.hospital_dashboards.forEach((component: any) => {
              this.componentOrder[component.component_id] = component.hospital_dashboard_order;

              maxOrder =
                component.hospital_dashboard_order !== undefined && maxOrder < component.hospital_dashboard_order
                  ? component.hospital_dashboard_order
                  : maxOrder;
            });
          }

          this.mailSetting = {
            hospital_setting_email_thanks: this.data.hospital_setting.hospital_setting_email_thanks,
            hospital_setting_monthly_report: this.data.hospital_setting.hospital_setting_monthly_report,
          };

          if (this.components && this.components.length) {
            this.components.map((component: any) => {
              component.isActive = this.componentOrder[component.component_id] !== undefined;
              component.hospital_dashboard_order = this.componentOrder[component.component_id] ?? maxOrder + 1;
              maxOrder = this.componentOrder[component.component_id] === undefined ? maxOrder + 1 : maxOrder;
            });
          }

          this.sharedService.showLoadingEventEmitter.emit(false);
        },
        (error: any) => {
          if (error.error.message === 'hospital not found' || isNaN(Number(hospitalID)) || Number(hospitalID) < 1) {
            let field = this.translate.instant('hospital');
            let mess = this.translate.instant(':field does not exist', { field: field });
            this.toastService.show(mess, { className: 'bg-red-100' });
            this.router.navigate(['/admin/hospital']);
          }
        }
      );
    } else {
      this.componentService.findMany({}).subscribe((data: any) => {
        this.components = data;
        if (this.components && this.components.length) {
          this.components.map((component: any) => {
            component.isActive = true;
            component.hospital_dashboard_order = maxOrder + 1;
            maxOrder++;
          });
        }

        this.data = {
          default_groups: [],
          hospital_address: '',
          hospital_code: '',
          hospital_dashboards: [],
          hospital_name: '',

          hospital_setting: {
            hospital_setting_patient_register_web: 0,
            hospital_setting_treatment_date: 0,
            hospital_setting_email_thanks: 0,
            hospital_setting_alert_function: 0,
            hospital_setting_register_notification: 0,
            hospital_setting_monthly_report: 0,
            hospital_setting_shinden_report: 0,
            hospital_setting_app_bp: 0,
            hospital_setting_confirm_log: 0,
            hospital_setting_help_type: 1,
            hospital_setting_threshold_bp: 1,
            hospital_setting_bp_avg_calculation_type: 1,
          },
          hospital_setting_functions: [],
        };
        this.alertFunction.forEach((key: string) => {
          this.data.hospital_setting_functions.push({
            hospital_setting_function_key: 'ALERT',
            hospital_setting_function_type: key,
            hospital_setting_function_status: 0,
          });
        });

        this.sharedService.showLoadingEventEmitter.emit(false);
      });
    }
  }

  /**
   * handle events when changeMailSetting is emit
   * @param e
   */
  onChangeMailSetting(e: any) {
    this.mailSetting[e.key] = e.value;
  }

  /**
   * handle event when submit button is clicked
   */
  public submitClicked() {
    forkJoin({
      basicInfo: this.basicInfo.onSubmit(),
      component: this.component.onSubmit(),
      hospitalSetting: this.hospitalSetting.onSubmit(),
      mailTemplate: this.mailTemplate.onSubmit(),
    }).subscribe((e) => {
      this.error = '';

      if (!e.basicInfo) {
        scrollIntoView('basic-info');
      } else if (!e.mailTemplate && e.hospitalSetting) {
        scrollIntoView('mail-template');
      }

      if (e.hospitalSetting && e.component && e.basicInfo && e.mailTemplate) {
        let data: any = {
          hospital_code: e.basicInfo.hospital_code,
          hospital_name: e.basicInfo.hospital_name,
          hospital_address: e.basicInfo.hospital_address,
          groups: [
            {
              group_name: e.basicInfo.default_group,
            },
          ],
          hospital_setting: e.hospitalSetting.hospital_setting,
          hospital_setting_functions: [],
          hospital_dashboards: [],
          hospital_email_templates: [],
        };

        if (e.hospitalSetting && e.hospitalSetting.hospital_setting_functions) {
          data.hospital_setting_functions = e.hospitalSetting.hospital_setting_functions;
        }

        if (e.component) {
          e.component.forEach((component: any) => {
            data.hospital_dashboards.push({
              component_id: component.component_id,
              hospital_dashboard_order: component.hospital_dashboard_order,
            });
          });
        }

        Object.keys(e.mailTemplate).map((key: string) => {
          if (e.mailTemplate[key] && e.mailTemplate[key] !== {}) {
            Object.keys(e.mailTemplate[key]).map((key2: string) => {
              if (
                e.mailTemplate[key][key2].hospital_email_template_subject ||
                e.mailTemplate[key][key2].hospital_email_template_message
              ) {
                data.hospital_email_templates.push({
                  hospital_email_template_subject: e.mailTemplate[key][key2].hospital_email_template_subject,
                  hospital_email_template_message: e.mailTemplate[key][key2].hospital_email_template_message,
                  hospital_email_template_language: this.lang[key],
                  hospital_email_template_type: key2,
                });
              }
            });
          }
        });

        if (this.isCreate) {
          this.onCreateHospital(data);
        } else {
          this.onEditHospital(data);
        }
      }
    });
  }

  /**
   * call api create hospital
   * @param data
   */
  onCreateHospital(data: any) {
    this.hospitalService.create(data).subscribe(
      (e) => {
        this.router.navigate(['/admin/hospital']);
        this.sharedService.showLoadingEventEmitter.emit(false);
      },
      (error) => {
        if (error.error.message === 'hospital code already exists') {
          this.sharedService.showLoadingEventEmitter.emit(false);
          this.error = error.error.message;
        }
      }
    );
  }

  /**
   * call api edit hospital
   * @param data
   */
  onEditHospital(data: any) {
    this.hospitalService.update({ ...data, hospital_id: this.hospitalId }).subscribe(
      (e) => {
        this.router.navigate(['/admin/hospital']);
        this.sharedService.showLoadingEventEmitter.emit(false);
      },
      (error) => {
        if (error.error.message === 'hospital_id does not exist') {
          let field = this.translate.instant('hospital');
          let mess = this.translate.instant(':field does not exist', { field: field });
          this.toastService.show(mess, { className: 'bg-red-100' });
          this.router.navigate(['/admin/hospital']);
        } else if (error.error.message === 'hospital code already exists') {
          this.error = error.error.message;
        }

        this.sharedService.showLoadingEventEmitter.emit(false);
      }
    );
  }

  /**
   * handle event when cancel button is clicked
   */
  public oncancelClicked() {
    this.router.navigate(['/admin/hospital']);
  }
}
