import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyWeightHistoryModalComponent } from './body-weight-history-modal.component';

describe('BodyWeightHistoryModalComponent', () => {
  let component: BodyWeightHistoryModalComponent;
  let fixture: ComponentFixture<BodyWeightHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BodyWeightHistoryModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyWeightHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
