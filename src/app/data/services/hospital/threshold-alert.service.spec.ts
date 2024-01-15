import { TestBed } from '@angular/core/testing';

import { ThresholdAlertService } from './threshold-alert.service';

describe('ThresholdAlertService', () => {
  let service: ThresholdAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThresholdAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
