import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDetailErrorComponent } from './help-detail-error.component';

describe('HelpDetailErrorComponent', () => {
  let component: HelpDetailErrorComponent;
  let fixture: ComponentFixture<HelpDetailErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpDetailErrorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpDetailErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
