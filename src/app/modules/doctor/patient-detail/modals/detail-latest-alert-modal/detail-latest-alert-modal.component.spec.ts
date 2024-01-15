import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailLatestAlertModalComponent } from './detail-latest-alert-modal.component';

describe('DetailLatestAlertModalComponent', () => {
  let component: DetailLatestAlertModalComponent;
  let fixture: ComponentFixture<DetailLatestAlertModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailLatestAlertModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailLatestAlertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
