import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimunMetsComponent } from './minimun-mets.component';

describe('MinimunMetsComponent', () => {
  let component: MinimunMetsComponent;
  let fixture: ComponentFixture<MinimunMetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MinimunMetsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinimunMetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
