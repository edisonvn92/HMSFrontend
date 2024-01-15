import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepCountHistoryModalComponent } from './step-count-history-modal.component';

describe('StepCountHistoryModalComponent', () => {
  let component: StepCountHistoryModalComponent;
  let fixture: ComponentFixture<StepCountHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StepCountHistoryModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepCountHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
