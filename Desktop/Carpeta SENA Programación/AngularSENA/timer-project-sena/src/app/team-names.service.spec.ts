import { TestBed } from '@angular/core/testing';

import { TeamNamesService } from './team-names.service';

describe('TeamNamesService', () => {
  let service: TeamNamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamNamesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
