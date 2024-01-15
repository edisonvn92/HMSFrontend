import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyWeightChartComponent } from './body-weight-chart.component';

describe('BodyWeightChartComponent', () => {
  let component: BodyWeightChartComponent;
  let fixture: ComponentFixture<BodyWeightChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BodyWeightChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyWeightChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
