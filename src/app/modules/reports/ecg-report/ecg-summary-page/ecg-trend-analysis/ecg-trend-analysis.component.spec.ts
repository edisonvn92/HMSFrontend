import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgTrendAnalysisComponent } from './ecg-trend-analysis.component';

describe('EcgTrendAnalysisComponent', () => {
  let component: EcgTrendAnalysisComponent;
  let fixture: ComponentFixture<EcgTrendAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EcgTrendAnalysisComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcgTrendAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
