import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestOfficeBloodPressureComponent } from './latest-office-blood-pressure.component';

describe('LatestOfficeBloodPressureComponent', () => {
  let component: LatestOfficeBloodPressureComponent;
  let fixture: ComponentFixture<LatestOfficeBloodPressureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LatestOfficeBloodPressureComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestOfficeBloodPressureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
