import { TestBed, async, inject } from '@angular/core/testing';

import { ProblemGuard } from './problem.guard';

describe('ProblemGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProblemGuard]
    });
  });

  it('should ...', inject([ProblemGuard], (guard: ProblemGuard) => {
    expect(guard).toBeTruthy();
  }));
});
