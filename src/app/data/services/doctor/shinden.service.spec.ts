import { TestBed } from '@angular/core/testing';

import { ShindenService } from './shinden.service';

describe('PatientService', () => {
  let service: ShindenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShindenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
