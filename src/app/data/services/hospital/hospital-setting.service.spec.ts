import { TestBed } from '@angular/core/testing';

import { HospitalSettingService } from './hospital-setting.service';

describe('HospitalSettingService', () => {
  let service: HospitalSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HospitalSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
