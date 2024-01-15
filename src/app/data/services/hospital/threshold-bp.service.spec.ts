import { TestBed } from '@angular/core/testing';

import { ThresholdBPService } from './threshold-bp.service';

describe('ThresholdBpService', () => {
  let service: ThresholdBPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThresholdBPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
