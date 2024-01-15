import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { hospitalEmailTemplateType } from '@shared/helpers/data';
import { of } from 'rxjs';
import { languages, mailType } from './data';

@Component({
  selector: 'app-mail-template',
  templateUrl: './mail-template.component.html',
  styleUrls: ['./mail-template.component.scss'],
})
export class MailTemplateComponent implements OnChanges {
  @Input() mailTemplate: any;
  @Input() mailSetting: any;

  public languages = languages;
  public lang = 'en';
  public mailType = mailType;
  public errMess: any;
  public isError = false;
  public template: any = {
    en: {
      1: { hospital_email_template_subject: '', hospital_email_template_message: '' },
      2: { hospital_email_template_subject: '', hospital_email_template_message: '' },
      3: { hospital_email_template_subject: '', hospital_email_template_message: '' },
    },
    ja: {
      1: { hospital_email_template_subject: '', hospital_email_template_message: '' },
      2: { hospital_email_template_subject: '', hospital_email_template_message: '' },
      3: { hospital_email_template_subject: '', hospital_email_template_message: '' },
    },
    zh_CN: {
      1: { hospital_email_template_subject: '', hospital_email_template_message: '' },
      2: { hospital_email_template_subject: '', hospital_email_template_message: '' },
      3: { hospital_email_template_subject: '', hospital_email_template_message: '' },
    },
    zh_TW: {
      1: { hospital_email_template_subject: '', hospital_email_template_message: '' },
      2: { hospital_email_template_subject: '', hospital_email_template_message: '' },
      3: { hospital_email_template_subject: '', hospital_email_template_message: '' },
    },
  };
  public hospitalEmailTemplateType = hospitalEmailTemplateType;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mailTemplate && this.mailTemplate && this.mailTemplate.length) {
      this.mailTemplate.forEach((item: any) => {
        this.template[this.convertMailLang(item.hospital_email_template_language)][
          item.hospital_email_template_type
        ].hospital_email_template_subject = item.hospital_email_template_subject;
        this.template[this.convertMailLang(item.hospital_email_template_language)][
          item.hospital_email_template_type
        ].hospital_email_template_message = item.hospital_email_template_message;
      });
    }
  }

  convertMailLang(lang: string) {
    if (lang === 'zh-cn') return 'zh_CN';
    if (lang === 'zh-tw') return 'zh_TW';
    return lang;
  }

  /**
   * handle event when submitSuccess event emitted
   * @param data
   */
  onSubmit() {
    this.errMess = {};
    this.isError = !this.onValidateMail();
    if (this.isError) {
      return of(null);
    }

    return of(this.template);
  }

  onValidateMail() {
    let flag = true;
    let languages = JSON.parse(JSON.stringify(this.languages));
    let subCondition: any = {
      2: 'hospital_setting_monthly_report',
      3: 'hospital_setting_email_thanks',
    };

    let langErr: any = [];

    this.languages.forEach((lang: any) => {
      this.mailType.forEach((type: any) => {
        if (lang.key === 'en') {
          if (
            (subCondition[type.id] === undefined || this.mailSetting[subCondition[type.id]]) &&
            !this.template.en[type.id].hospital_email_template_subject
          ) {
            this.errMess[`en_subject_${type.id}_required`] = 1;
            flag = false;
            langErr.push('en');
          }

          if (
            (subCondition[type.id] === undefined || this.mailSetting[subCondition[type.id]]) &&
            !this.template.en[type.id].hospital_email_template_message
          ) {
            this.errMess[`en_message_${type.id}_required`] = 1;
            flag = false;
            langErr.push('en');
          }
        } else if (
          (subCondition[type.id] === undefined || this.mailSetting[subCondition[type.id]]) &&
          ((this.template[lang.key][type.id].hospital_email_template_message.length &&
            !this.template[lang.key][type.id].hospital_email_template_subject.length) ||
            (!this.template[lang.key][type.id].hospital_email_template_message.length &&
              this.template[lang.key][type.id].hospital_email_template_subject.length))
        ) {
          this.errMess.mail_full = 1;
          this.lang = lang.key;
          langErr.push(lang.key);
          flag = false;
        }
      });
    });

    this.languages.forEach((lang: any) => {
      if (
        this.template[lang.key][hospitalEmailTemplateType.EMAIL_REPORT_MANUAL_BP].hospital_email_template_message
          .length +
          this.template[lang.key][hospitalEmailTemplateType.EMAIL_REPORT_MANUAL_BP].hospital_email_template_subject
            .length >
        200
      ) {
        this.errMess.max_length = 1;
        this.lang = lang.key;
        langErr.push(lang.key);
        flag = false;
      }
    });

    languages.reverse().forEach((lang: any) => {
      if (langErr.includes(lang.key)) {
        this.lang = lang.key;
      }
    });

    return flag;
  }
}
