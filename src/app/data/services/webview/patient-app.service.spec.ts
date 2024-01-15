import { TestBed } from '@angular/core/testing';

import { PatientAppService } from './patient-app.service';

describe('PatientAppService', () => {
  let service: PatientAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
