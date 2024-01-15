import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestMedicalExaminationDateComponent } from './latest-medical-examination-date.component';

describe('LatestMedicalExaminationDateComponent', () => {
  let component: LatestMedicalExaminationDateComponent;
  let fixture: ComponentFixture<LatestMedicalExaminationDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LatestMedicalExaminationDateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestMedicalExaminationDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
