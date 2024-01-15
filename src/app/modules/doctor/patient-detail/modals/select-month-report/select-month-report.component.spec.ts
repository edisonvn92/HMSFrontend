import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMonthReportComponent } from './select-month-report.component';

describe('SelectMonthReportComponent', () => {
  let component: SelectMonthReportComponent;
  let fixture: ComponentFixture<SelectMonthReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectMonthReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMonthReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
