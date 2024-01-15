import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodPressureByDayOfWeekTableComponent } from './blood-pressure-by-day-of-week-table.component';

describe('BloodPressureByDayOfWeekTableComponent', () => {
  let component: BloodPressureByDayOfWeekTableComponent;
  let fixture: ComponentFixture<BloodPressureByDayOfWeekTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BloodPressureByDayOfWeekTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodPressureByDayOfWeekTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
