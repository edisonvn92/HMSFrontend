import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureHistoryModalComponent } from './temperature-history-modal.component';

describe('TemperatureHistoryModalComponent', () => {
  let component: TemperatureHistoryModalComponent;
  let fixture: ComponentFixture<TemperatureHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemperatureHistoryModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperatureHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
