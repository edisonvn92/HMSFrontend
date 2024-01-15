import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShindenAdviceRegistrationCompleteComponent } from './shinden-advice-registration-complete.component';

describe('ShindenAdviceRegistrationCompleteComponent', () => {
  let component: ShindenAdviceRegistrationCompleteComponent;
  let fixture: ComponentFixture<ShindenAdviceRegistrationCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShindenAdviceRegistrationCompleteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShindenAdviceRegistrationCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
