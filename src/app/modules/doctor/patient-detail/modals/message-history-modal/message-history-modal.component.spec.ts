import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageHistoryModalComponent } from './message-history-modal.component';

describe('MessageHistoryModalComponent', () => {
  let component: MessageHistoryModalComponent;
  let fixture: ComponentFixture<MessageHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageHistoryModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
