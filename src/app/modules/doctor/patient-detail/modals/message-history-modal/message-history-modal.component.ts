import { Component, Input, OnInit } from '@angular/core';
import { PatientService } from '@data/services/doctor/patient.service';
import { fullDayOfWeek } from '@shared/helpers/data';
import { SharedService } from '@shared/services/shared.service';
import moment from 'moment';

@Component({
  selector: 'app-message-history-modal',
  templateUrl: './message-history-modal.component.html',
  styleUrls: ['./message-history-modal.component.scss'],
})
export class MessageHistoryModalComponent implements OnInit {
  @Input() patientId!: string;

  public listMessage: any;
  public lastScroll = 0;
  public page = 1;
  public showLoading = false;
  public lastMessageId = 0;
  public fullDayOfWeek = fullDayOfWeek;
  public isGetMessage = true;

  constructor(public sharedService: SharedService, private patientService: PatientService) {}

  ngOnInit(): void {
    this.getMessage();
  }

  /**
   * scroll screen to position
   */
  scrollDown() {
    setTimeout(() => {
      let el = document.getElementById('message-container');
      if (el) {
        el.scrollTo({
          top: el.scrollHeight - this.lastScroll,
          behavior: 'auto',
        });
        this.lastScroll = el.scrollHeight;
      }
    }, 0);
  }

  /**
   * get patient message
   */
  getMessage() {
    if (this.isGetMessage) {
      this.showLoading = true;
      this.patientService
        .getMessageHistory({
          patient_id: this.patientId,
          last_message_id: this.lastMessageId,
          language: this.sharedService.isJa() ? 'ja' : 'zh_tw',
        })
        .subscribe(
          (data: any) => {
            if (data.data?.length) {
              let currentDate = '';
              if (data.data?.length < 20) {
                this.isGetMessage = false;
              }
              let dataMessage = data.data
                .reverse()
                .sort((log1: any, log2: any) => {
                  let date1 = moment(log1.activated_at).toDate();
                  let date2 = moment(log2.activated_at).toDate();
                  return date1.getTime() - date2.getTime();
                })
                .map((message: any) => {
                  const date = message.activated_at;
                  let isShowDate = !moment(date).isSame(currentDate, 'day');
                  currentDate = date;
                  let messageText = message?.message_template.message_languages[0].message_language_text;
                  if (JSON.parse(message.patient_message_data)) {
                    (Object.values(JSON.parse(message.patient_message_data)) as any[]).map(
                      (param: string, index: number) => {
                        messageText = messageText.replaceAll(`{${index + 1}}`, param);
                      }
                    );
                  }

                  const dayOfWeek = `message date.${this.fullDayOfWeek[new Date(date).getDay()]}`;

                  return { ...message, day_of_week: dayOfWeek, message_text: messageText, isShowDate };
                });

              this.lastMessageId = dataMessage[0].patient_message_id;

              if (this.listMessage && this.listMessage.length) {
                if (this.listMessage[0] && this.listMessage[0].isShowDate && dataMessage.length) {
                  const date = this.listMessage[0].activated_at;
                  this.listMessage[0].isShowDate = !moment(date).isSame(
                    dataMessage[dataMessage.length - 1].activated_at,
                    'day'
                  );
                }
                this.listMessage = dataMessage.concat(this.listMessage);
              } else {
                this.listMessage = dataMessage;
              }

              this.scrollDown();
              this.page += 1;
            }
            this.showLoading = false;
          },
          (err: any) => {
            this.showLoading = false;
          }
        );
    }
  }

  /**
   * handle event when scroll event has been called
   * @param event :any
   */
  onScroll(event: any) {
    if (event.target.scrollTop === 0) {
      this.getMessage();
    }
  }
}
