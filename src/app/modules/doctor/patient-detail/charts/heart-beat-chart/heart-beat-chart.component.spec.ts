import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartBeatChartComponent } from './heart-beat-chart.component';

describe('HeartBeatChartComponent', () => {
  let component: HeartBeatChartComponent;
  let fixture: ComponentFixture<HeartBeatChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeartBeatChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeartBeatChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
