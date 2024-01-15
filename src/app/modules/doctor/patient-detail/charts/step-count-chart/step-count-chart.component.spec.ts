import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepCountChartComponent } from './step-count-chart.component';

describe('StepCountChartComponent', () => {
  let component: StepCountChartComponent;
  let fixture: ComponentFixture<StepCountChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StepCountChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepCountChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
