import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectiveSymptomChartComponent } from './subjective-symptom-chart.component';

describe('SubjectiveSymptomChartComponent', () => {
  let component: SubjectiveSymptomChartComponent;
  let fixture: ComponentFixture<SubjectiveSymptomChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubjectiveSymptomChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectiveSymptomChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
