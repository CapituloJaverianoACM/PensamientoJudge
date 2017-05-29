import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemPanelComponent } from './problem-panel.component';

describe('ProblemPanelComponent', () => {
  let component: ProblemPanelComponent;
  let fixture: ComponentFixture<ProblemPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProblemPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
