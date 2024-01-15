import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mail-sent-modal',
  templateUrl: './mail-sent-modal.component.html',
  styleUrls: ['./mail-sent-modal.component.scss'],
})
export class MailSentModalComponent implements OnInit {
  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  /**
   * function when click ok
   */
  clickOk() {
    this.activeModal.close();
  }
}
