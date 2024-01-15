import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NYHAChartComponent } from './nyha-chart.component';

describe('NYHAChartComponent', () => {
  let component: NYHAChartComponent;
  let fixture: ComponentFixture<NYHAChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NYHAChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NYHAChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
