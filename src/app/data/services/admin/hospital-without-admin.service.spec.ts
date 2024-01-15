import { TestBed } from '@angular/core/testing';

import { HospitalWithoutAdminService } from './hospital-without-admin.service';

describe('HospitalWithoutAdminService', () => {
  let service: HospitalWithoutAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HospitalWithoutAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
