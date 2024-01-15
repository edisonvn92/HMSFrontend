import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportHistoryModalComponent } from './report-history-modal.component';

describe('ReportHistoryModalComponent', () => {
  let component: ReportHistoryModalComponent;
  let fixture: ComponentFixture<ReportHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportHistoryModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
