import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgRecordListPageComponent } from './ecg-record-list-page.component';

describe('EcgRecordListPageComponent', () => {
  let component: EcgRecordListPageComponent;
  let fixture: ComponentFixture<EcgRecordListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EcgRecordListPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcgRecordListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
