import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewHeartFailureComponent } from './review-heart-failure.component';

describe('ReviewHeartFailureComponent', () => {
  let component: ReviewHeartFailureComponent;
  let fixture: ComponentFixture<ReviewHeartFailureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewHeartFailureComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewHeartFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
