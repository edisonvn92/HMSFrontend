import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingTimeComponent } from './setting-time.component';

describe('SettingTimeComponent', () => {
  let component: SettingTimeComponent;
  let fixture: ComponentFixture<SettingTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingTimeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
