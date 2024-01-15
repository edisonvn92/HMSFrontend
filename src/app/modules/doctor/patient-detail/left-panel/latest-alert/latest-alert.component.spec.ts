import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestAlertComponent } from './latest-alert.component';

describe('LatestAlertComponent', () => {
  let component: LatestAlertComponent;
  let fixture: ComponentFixture<LatestAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LatestAlertComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
