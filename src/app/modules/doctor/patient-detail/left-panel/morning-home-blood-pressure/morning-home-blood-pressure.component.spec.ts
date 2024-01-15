import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorningHomeBloodPressureComponent } from './morning-home-blood-pressure.component';

describe('MorningHomeBloodPressureComponent', () => {
  let component: MorningHomeBloodPressureComponent;
  let fixture: ComponentFixture<MorningHomeBloodPressureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MorningHomeBloodPressureComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MorningHomeBloodPressureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
