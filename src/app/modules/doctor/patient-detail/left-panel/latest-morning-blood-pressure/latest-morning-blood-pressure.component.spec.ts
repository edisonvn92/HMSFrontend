import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestMorningBloodPressureComponent } from './latest-morning-blood-pressure.component';

describe('LatestMorningBloodPressureComponent', () => {
  let component: LatestMorningBloodPressureComponent;
  let fixture: ComponentFixture<LatestMorningBloodPressureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LatestMorningBloodPressureComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestMorningBloodPressureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
