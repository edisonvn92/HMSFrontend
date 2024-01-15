import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartBeatReportComponent } from './heart-beat-report.component';

describe('HeartBeatReportComponent', () => {
  let component: HeartBeatReportComponent;
  let fixture: ComponentFixture<HeartBeatReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeartBeatReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeartBeatReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
