import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmExaminationDateComponent } from './confirm-examination-date.component';

describe('ConfirmExaminationDateComponent', () => {
  let component: ConfirmExaminationDateComponent;
  let fixture: ComponentFixture<ConfirmExaminationDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmExaminationDateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmExaminationDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
