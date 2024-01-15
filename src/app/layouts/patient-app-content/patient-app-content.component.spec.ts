import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAppContentComponent } from './patient-app-content.component';

describe('PatientAppContentComponent', () => {
  let component: PatientAppContentComponent;
  let fixture: ComponentFixture<PatientAppContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientAppContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAppContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
