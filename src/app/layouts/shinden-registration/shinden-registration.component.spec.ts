import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShindenRegistrationComponent } from './shinden-registration.component';

describe('ShindenRegistrationComponent', () => {
  let component: ShindenRegistrationComponent;
  let fixture: ComponentFixture<ShindenRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShindenRegistrationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShindenRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
