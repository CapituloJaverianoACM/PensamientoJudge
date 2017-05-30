import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProblemEditComponent } from './admin-problem-edit.component';

describe('AdminProblemEditComponent', () => {
  let component: AdminProblemEditComponent;
  let fixture: ComponentFixture<AdminProblemEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProblemEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProblemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
