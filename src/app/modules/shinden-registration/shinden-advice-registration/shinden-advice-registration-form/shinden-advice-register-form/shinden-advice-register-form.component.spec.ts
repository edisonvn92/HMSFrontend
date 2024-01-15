import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShindenAdviceRegisterFormComponent } from './shinden-advice-register-form.component';

describe('ShindenAdviceRegisterFormComponent', () => {
  let component: ShindenAdviceRegisterFormComponent;
  let fixture: ComponentFixture<ShindenAdviceRegisterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShindenAdviceRegisterFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShindenAdviceRegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
