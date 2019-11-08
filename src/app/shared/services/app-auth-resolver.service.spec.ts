import { TestBed } from '@angular/core/testing';

import { AppAuthResolverService } from './app-auth-resolver.service';

describe('AppAuthResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppAuthResolverService = TestBed.get(AppAuthResolverService);
    expect(service).toBeTruthy();
  });
});
