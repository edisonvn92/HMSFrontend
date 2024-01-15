import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationTopComponent } from './registration-top.component';

describe('RegistrationTopComponent', () => {
  let component: RegistrationTopComponent;
  let fixture: ComponentFixture<RegistrationTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrationTopComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
