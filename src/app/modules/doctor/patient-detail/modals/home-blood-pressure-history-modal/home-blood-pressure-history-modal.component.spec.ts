import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBloodPressureHistoryModalComponent } from './home-blood-pressure-history-modal.component';

describe('HomeBloodPressureHistoryModalComponent', () => {
  let component: HomeBloodPressureHistoryModalComponent;
  let fixture: ComponentFixture<HomeBloodPressureHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeBloodPressureHistoryModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeBloodPressureHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
