import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodPressureReportComponent } from './blood-pressure-report.component';

describe('BloodPressureReportComponent', () => {
  let component: BloodPressureReportComponent;
  let fixture: ComponentFixture<BloodPressureReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BloodPressureReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodPressureReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
