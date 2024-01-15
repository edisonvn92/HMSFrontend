import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShindenAdviceRegistrationConfirmComponent } from './shinden-advice-registration-confirm.component';

describe('ShindenAdviceRegistrationConfirmComponent', () => {
  let component: ShindenAdviceRegistrationConfirmComponent;
  let fixture: ComponentFixture<ShindenAdviceRegistrationConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShindenAdviceRegistrationConfirmComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShindenAdviceRegistrationConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
