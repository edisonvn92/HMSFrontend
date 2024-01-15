import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationChartComponent } from './medication-chart.component';

describe('MedicationChartComponent', () => {
  let component: MedicationChartComponent;
  let fixture: ComponentFixture<MedicationChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicationChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
