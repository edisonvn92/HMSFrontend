import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPChartComponent } from './bp-chart.component';

describe('BpMedicationChartComponent', () => {
  let component: BPChartComponent;
  let fixture: ComponentFixture<BPChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BPChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BPChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
