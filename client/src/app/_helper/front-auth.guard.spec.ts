import { TestBed } from '@angular/core/testing';

import { FrontAuthGuard } from './front-auth.guard';

describe('FrontAuthGuard', () => {
  let guard: FrontAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FrontAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
