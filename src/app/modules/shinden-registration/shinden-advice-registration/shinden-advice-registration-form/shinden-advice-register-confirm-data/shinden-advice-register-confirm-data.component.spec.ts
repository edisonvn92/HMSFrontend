import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShindenAdviceRegisterConfirmDataComponent } from './shinden-advice-register-confirm-data.component';

describe('ShindenAdviceRegisterConfirmDataComponent', () => {
  let component: ShindenAdviceRegisterConfirmDataComponent;
  let fixture: ComponentFixture<ShindenAdviceRegisterConfirmDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShindenAdviceRegisterConfirmDataComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShindenAdviceRegisterConfirmDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
