import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShindenAdviceRegistrationTopComponent } from './shinden-advice-registration-top.component';

describe('ShindenAdviceRegistrationTopComponent', () => {
  let component: ShindenAdviceRegistrationTopComponent;
  let fixture: ComponentFixture<ShindenAdviceRegistrationTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShindenAdviceRegistrationTopComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShindenAdviceRegistrationTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
