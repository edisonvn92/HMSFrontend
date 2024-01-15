import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShindenAdviceRegistrationFormComponent } from './shinden-advice-registration-form.component';

describe('ShindenAdviceRegistrationFormComponent', () => {
  let component: ShindenAdviceRegistrationFormComponent;
  let fixture: ComponentFixture<ShindenAdviceRegistrationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShindenAdviceRegistrationFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShindenAdviceRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
