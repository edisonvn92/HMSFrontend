import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertCommentModalComponent } from './alert-comment-modal.component';

describe('AlertCommentModalComponent', () => {
  let component: AlertCommentModalComponent;
  let fixture: ComponentFixture<AlertCommentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertCommentModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertCommentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
