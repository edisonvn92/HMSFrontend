import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAnalysisNoteComponent } from './patient-analysis-note.component';

describe('PatientAnalysisNoteComponent', () => {
  let component: PatientAnalysisNoteComponent;
  let fixture: ComponentFixture<PatientAnalysisNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientAnalysisNoteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAnalysisNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
