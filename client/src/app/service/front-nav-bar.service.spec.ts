import { TestBed } from '@angular/core/testing';

import { FrontNavBarService } from './front-nav-bar.service';

describe('FrontNavBarService', () => {
  let service: FrontNavBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrontNavBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
