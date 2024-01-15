import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EveningHomeBloodPressureComponent } from './evening-home-blood-pressure.component';

describe('EveningHomeBloodPressureComponent', () => {
  let component: EveningHomeBloodPressureComponent;
  let fixture: ComponentFixture<EveningHomeBloodPressureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EveningHomeBloodPressureComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EveningHomeBloodPressureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
