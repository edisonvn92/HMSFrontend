import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingBloodThresholdComponent } from './setting-blood-threshold.component';

describe('SettingBloodThresholdComponent', () => {
  let component: SettingBloodThresholdComponent;
  let fixture: ComponentFixture<SettingBloodThresholdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingBloodThresholdComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingBloodThresholdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
