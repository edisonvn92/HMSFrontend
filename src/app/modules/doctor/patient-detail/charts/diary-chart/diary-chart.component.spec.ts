import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaryChartComponent } from './diary-chart.component';

describe('DiaryChartComponent', () => {
  let component: DiaryChartComponent;
  let fixture: ComponentFixture<DiaryChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiaryChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiaryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
