import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRequestAnalysisComponent } from './patient-request-analysis.component';

describe('PatientRequestAnalysisComponent', () => {
  let component: PatientRequestAnalysisComponent;
  let fixture: ComponentFixture<PatientRequestAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientRequestAnalysisComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientRequestAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
