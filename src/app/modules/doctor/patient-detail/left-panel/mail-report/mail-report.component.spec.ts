import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MailReportComponent } from './mail-report.component';

describe('MailComponent', () => {
  let component: MailReportComponent;
  let fixture: ComponentFixture<MailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MailReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
