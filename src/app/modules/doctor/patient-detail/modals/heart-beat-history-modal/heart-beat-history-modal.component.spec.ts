import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartBeatHistoryModalComponent } from './heart-beat-history-modal.component';

describe('HeartBeatHistoryModalComponent', () => {
  let component: HeartBeatHistoryModalComponent;
  let fixture: ComponentFixture<HeartBeatHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeartBeatHistoryModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeartBeatHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
