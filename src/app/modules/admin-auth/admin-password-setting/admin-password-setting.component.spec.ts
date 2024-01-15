import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPasswordSettingComponent } from './admin-password-setting.component';

describe('AdminPasswordSettingComponent', () => {
  let component: AdminPasswordSettingComponent;
  let fixture: ComponentFixture<AdminPasswordSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPasswordSettingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPasswordSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
