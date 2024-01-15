import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodPressureHeartbeatChartComponent } from './blood-pressure-heartbeat-chart.component';

describe('BloodPressureHeartbeatChartComponent', () => {
  let component: BloodPressureHeartbeatChartComponent;
  let fixture: ComponentFixture<BloodPressureHeartbeatChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BloodPressureHeartbeatChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodPressureHeartbeatChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
