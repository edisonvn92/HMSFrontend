import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgSummaryPageComponent } from './ecg-summary-page.component';

describe('EcgSummaryPageComponent', () => {
  let component: EcgSummaryPageComponent;
  let fixture: ComponentFixture<EcgSummaryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EcgSummaryPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcgSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
