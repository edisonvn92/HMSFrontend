import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingAlertModalComponent } from './setting-alert-modal.component';

describe('SettingAlertModalComponent', () => {
  let component: SettingAlertModalComponent;
  let fixture: ComponentFixture<SettingAlertModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingAlertModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingAlertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
