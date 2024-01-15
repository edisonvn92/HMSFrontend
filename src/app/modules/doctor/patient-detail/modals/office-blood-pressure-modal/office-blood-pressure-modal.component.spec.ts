import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeBloodPressureModalComponent } from './office-blood-pressure-modal.component';

describe('OfficeBloodPressureModalComponent', () => {
  let component: OfficeBloodPressureModalComponent;
  let fixture: ComponentFixture<OfficeBloodPressureModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfficeBloodPressureModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeBloodPressureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
