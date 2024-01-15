import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelColumnTableComponent } from './label-column-table.component';

describe('LabelColumnTableComponent', () => {
  let component: LabelColumnTableComponent;
  let fixture: ComponentFixture<LabelColumnTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabelColumnTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelColumnTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
