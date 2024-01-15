import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyWeightComponent } from './body-weight.component';

describe('BodyWeightComponent', () => {
  let component: BodyWeightComponent;
  let fixture: ComponentFixture<BodyWeightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BodyWeightComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyWeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
