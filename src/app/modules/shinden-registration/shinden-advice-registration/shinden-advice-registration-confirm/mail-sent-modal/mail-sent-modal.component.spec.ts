import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailSentModalComponent } from './mail-sent-modal.component';

describe('MailSentModalComponent', () => {
  let component: MailSentModalComponent;
  let fixture: ComponentFixture<MailSentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MailSentModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailSentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
