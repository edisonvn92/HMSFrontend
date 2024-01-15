import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgReportComponent } from './ecg-report.component';

describe('EcgReportComponent', () => {
  let component: EcgReportComponent;
  let fixture: ComponentFixture<EcgReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EcgReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcgReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
