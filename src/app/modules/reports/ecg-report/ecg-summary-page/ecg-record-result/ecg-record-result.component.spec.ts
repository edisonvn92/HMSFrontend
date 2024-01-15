import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgRecordResultComponent } from './ecg-record-result.component';

describe('EcgRecordResultComponent', () => {
  let component: EcgRecordResultComponent;
  let fixture: ComponentFixture<EcgRecordResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EcgRecordResultComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcgRecordResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
