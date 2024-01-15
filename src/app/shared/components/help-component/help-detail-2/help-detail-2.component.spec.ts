import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDetail2Component } from './help-detail-2.component';

describe('HelpDetailComponent', () => {
  let component: HelpDetail2Component;
  let fixture: ComponentFixture<HelpDetail2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpDetail2Component],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpDetail2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
