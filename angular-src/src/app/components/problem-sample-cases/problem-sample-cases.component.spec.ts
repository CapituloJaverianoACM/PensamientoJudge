import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemSampleCasesComponent } from './problem-sample-cases.component';

describe('ProblemSampleCasesComponent', () => {
  let component: ProblemSampleCasesComponent;
  let fixture: ComponentFixture<ProblemSampleCasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProblemSampleCasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemSampleCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
