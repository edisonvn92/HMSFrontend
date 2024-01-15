import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodPressureTargetComponent } from './blood-pressure-target.component';

describe('BloodPressureTargetComponent', () => {
  let component: BloodPressureTargetComponent;
  let fixture: ComponentFixture<BloodPressureTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BloodPressureTargetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodPressureTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
