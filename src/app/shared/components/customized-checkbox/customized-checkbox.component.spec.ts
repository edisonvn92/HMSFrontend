import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizedCheckboxComponent } from './customized-checkbox.component';

describe('CustomizedCheckboxComponent', () => {
  let component: CustomizedCheckboxComponent;
  let fixture: ComponentFixture<CustomizedCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomizedCheckboxComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizedCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
