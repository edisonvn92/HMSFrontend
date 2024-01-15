import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMessageModalComponent } from './patient-message-modal.component';

describe('PatientMessageModalComponent', () => {
  let component: PatientMessageModalComponent;
  let fixture: ComponentFixture<PatientMessageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientMessageModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientMessageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
