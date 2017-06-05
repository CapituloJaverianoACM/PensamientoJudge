import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProblemTestCasesComponent } from './admin-problem-test-cases.component';

describe('AdminProblemTestCasesComponent', () => {
  let component: AdminProblemTestCasesComponent;
  let fixture: ComponentFixture<AdminProblemTestCasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProblemTestCasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProblemTestCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
