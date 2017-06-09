import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-problem-panel',
  templateUrl: './problem-panel.component.html',
  styleUrls: ['./problem-panel.component.css']
})
export class ProblemPanelComponent implements OnInit {
  @Input() nameProblem: string = "No Input";
  problem : any;
  constructor(
    private router : Router
  ) { }

  ngOnInit() {
    this.problem = this.nameProblem;
  }

  solveProblemOnClick(problemName) {
    this.router.navigate(['/problems/'+problemName]);
  }

  getMaxScore() {
    if(this.problem.description.testCases.length == 0) return 0;
    else return this.problem.description.testCases[0].length;
  }

}
