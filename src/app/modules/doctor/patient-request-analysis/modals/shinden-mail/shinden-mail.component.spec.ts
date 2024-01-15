import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShindenMailComponent } from './shinden-mail.component';

describe('ShindenMailComponent', () => {
  let component: ShindenMailComponent;
  let fixture: ComponentFixture<ShindenMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShindenMailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShindenMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
