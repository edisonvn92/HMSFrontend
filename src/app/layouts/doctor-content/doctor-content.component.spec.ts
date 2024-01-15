import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorContentComponent } from './doctor-content.component';

describe('DoctorContentComponent', () => {
  let component: DoctorContentComponent;
  let fixture: ComponentFixture<DoctorContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctorContentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
