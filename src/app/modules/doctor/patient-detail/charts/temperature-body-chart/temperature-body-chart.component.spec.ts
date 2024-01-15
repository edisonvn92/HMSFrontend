import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureBodyChartComponent } from './temperature-body-chart.component';

describe('TemperatureBodyChartComponent', () => {
  let component: TemperatureBodyChartComponent;
  let fixture: ComponentFixture<TemperatureBodyChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemperatureBodyChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperatureBodyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
