import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientGraphComponent } from './patient-graph.component';

describe('PatientGraphComponent', () => {
  let component: PatientGraphComponent;
  let fixture: ComponentFixture<PatientGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientGraphComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
