import { TestBed } from '@angular/core/testing';

import { HcpService } from './hcp.service';

describe('HcpService', () => {
  let service: HcpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HcpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
