import { TestBed } from '@angular/core/testing';

import { DataSyncTimeService } from './data-sync-time.service';

describe('DataSyncTimeService', () => {
  let service: DataSyncTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataSyncTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
