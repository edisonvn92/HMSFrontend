import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalSettingComponent } from './hospital-setting.component';

describe('HospitalSettingComponent', () => {
  let component: HospitalSettingComponent;
  let fixture: ComponentFixture<HospitalSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HospitalSettingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
