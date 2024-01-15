import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPMedicationChartComponent } from './bp-medication-chart.component';

describe('BPMedicationChartComponent', () => {
  let component: BPMedicationChartComponent;
  let fixture: ComponentFixture<BPMedicationChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BPMedicationChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BPMedicationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
