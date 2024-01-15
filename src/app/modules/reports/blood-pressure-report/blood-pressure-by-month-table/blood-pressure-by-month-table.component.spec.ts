import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodPressureByMonthTableComponent } from './blood-pressure-by-month-table.component';

describe('BloodPressureByMonthTableComponent', () => {
  let component: BloodPressureByMonthTableComponent;
  let fixture: ComponentFixture<BloodPressureByMonthTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BloodPressureByMonthTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodPressureByMonthTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
