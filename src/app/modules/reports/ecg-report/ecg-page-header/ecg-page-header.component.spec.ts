import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgPageHeaderComponent } from './ecg-page-header.component';

describe('EcgPageHeaderComponent', () => {
  let component: EcgPageHeaderComponent;
  let fixture: ComponentFixture<EcgPageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EcgPageHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcgPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
