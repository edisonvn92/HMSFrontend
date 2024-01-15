import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAnalysisDetailComponent } from './request-analysis-detail.component';

describe('RequestAnalysisDetailComponent', () => {
  let component: RequestAnalysisDetailComponent;
  let fixture: ComponentFixture<RequestAnalysisDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestAnalysisDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestAnalysisDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
