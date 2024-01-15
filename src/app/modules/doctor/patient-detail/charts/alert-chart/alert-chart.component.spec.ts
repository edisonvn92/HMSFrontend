import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertChartComponent } from './alert-chart.component';

describe('AlertChartComponent', () => {
  let component: AlertChartComponent;
  let fixture: ComponentFixture<AlertChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
