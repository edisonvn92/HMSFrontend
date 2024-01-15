import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDetail1Component } from './help-detail-1.component';

describe('HelpDetailComponent', () => {
  let component: HelpDetail1Component;
  let fixture: ComponentFixture<HelpDetail1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpDetail1Component],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpDetail1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
