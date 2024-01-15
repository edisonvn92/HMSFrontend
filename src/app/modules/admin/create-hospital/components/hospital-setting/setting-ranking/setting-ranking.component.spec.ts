import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingRankingComponent } from './setting-ranking.component';

describe('SettingRankingComponent', () => {
  let component: SettingRankingComponent;
  let fixture: ComponentFixture<SettingRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingRankingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
