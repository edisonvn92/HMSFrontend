import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShindenMailFormComponent } from './shinden-mail-form.component';

describe('ShindenMailFormComponent', () => {
  let component: ShindenMailFormComponent;
  let fixture: ComponentFixture<ShindenMailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShindenMailFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShindenMailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
