import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartFailureDrugUseChartComponent } from './heart-failure-drug-use-chart.component';

describe('HeartFailureDrugUseChartComponent', () => {
  let component: HeartFailureDrugUseChartComponent;
  let fixture: ComponentFixture<HeartFailureDrugUseChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeartFailureDrugUseChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeartFailureDrugUseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
