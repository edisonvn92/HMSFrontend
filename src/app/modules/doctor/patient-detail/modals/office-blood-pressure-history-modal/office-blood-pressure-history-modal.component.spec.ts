import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeBloodPressureHistoryModalComponent } from './office-blood-pressure-history-modal.component';

describe('OfficeBloodPressureHistoryModalComponent', () => {
  let component: OfficeBloodPressureHistoryModalComponent;
  let fixture: ComponentFixture<OfficeBloodPressureHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfficeBloodPressureHistoryModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeBloodPressureHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
