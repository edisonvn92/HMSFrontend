import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingHistoryModalComponent } from './ranking-history-modal.component';

describe('RankingHistoryModalComponent', () => {
  let component: RankingHistoryModalComponent;
  let fixture: ComponentFixture<RankingHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RankingHistoryModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
