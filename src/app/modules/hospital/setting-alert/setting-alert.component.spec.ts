import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingAlertComponent } from './setting-alert.component';

describe('SettingAlertComponent', () => {
  let component: SettingAlertComponent;
  let fixture: ComponentFixture<SettingAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingAlertComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
