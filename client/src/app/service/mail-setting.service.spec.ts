import { TestBed } from '@angular/core/testing';

import { MailSettingService } from './mail-setting.service';

describe('MailSettingService', () => {
  let service: MailSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MailSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
