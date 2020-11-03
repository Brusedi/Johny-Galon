import { TestBed } from '@angular/core/testing';

import { RiskCheckServiceService } from './risk-check-service.service';

describe('RiskCheckServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RiskCheckServiceService = TestBed.get(RiskCheckServiceService);
    expect(service).toBeTruthy();
  });
});
