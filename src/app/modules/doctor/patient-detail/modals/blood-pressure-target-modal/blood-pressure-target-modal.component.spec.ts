import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodPressureTargetModalComponent } from './blood-pressure-target-modal.component';

describe('BloodPressureTargetModalComponent', () => {
  let component: BloodPressureTargetModalComponent;
  let fixture: ComponentFixture<BloodPressureTargetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BloodPressureTargetModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodPressureTargetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
