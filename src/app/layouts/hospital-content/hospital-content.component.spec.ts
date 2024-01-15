import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalContentComponent } from './hospital-content.component';

describe('HospitalContentComponent', () => {
  let component: HospitalContentComponent;
  let fixture: ComponentFixture<HospitalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HospitalContentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
