import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDetail3Component } from './help-detail-3.component';

describe('HelpDetailComponent', () => {
  let component: HelpDetail3Component;
  let fixture: ComponentFixture<HelpDetail3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpDetail3Component],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpDetail3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
