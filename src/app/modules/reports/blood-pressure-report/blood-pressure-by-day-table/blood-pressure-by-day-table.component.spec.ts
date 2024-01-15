import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodPressureByDayTableComponent } from './blood-pressure-by-day-table.component';

describe('BloodPressureByDayTableComponent', () => {
  let component: BloodPressureByDayTableComponent;
  let fixture: ComponentFixture<BloodPressureByDayTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BloodPressureByDayTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodPressureByDayTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
