import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyVitalPopupComponent } from './daily-vital-popup.component';

describe('DailyVitalPopupComponent', () => {
  let component: DailyVitalPopupComponent;
  let fixture: ComponentFixture<DailyVitalPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DailyVitalPopupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyVitalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
