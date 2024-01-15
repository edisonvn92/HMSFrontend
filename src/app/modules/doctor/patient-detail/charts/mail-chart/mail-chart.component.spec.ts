import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailChartComponent } from './mail-chart.component';

describe('MailChartComponent', () => {
  let component: MailChartComponent;
  let fixture: ComponentFixture<MailChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MailChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
