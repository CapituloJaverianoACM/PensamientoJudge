import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProblemService } from '../../services/problem.service';
@Component({
  selector: 'app-problem-panel',
  templateUrl: './problem-panel.component.html',
  styleUrls: ['./problem-panel.component.css']
})
export class ProblemPanelComponent implements OnInit {
  @Input() nameProblem: string = "No Input";
  problem : any;
  private problemSuccessRate: Number;
  constructor(
    private router : Router,
    private problemService: ProblemService
  ) { }

  ngOnInit() {
    this.problem = this.nameProblem;
    this.getProblemSuccessRate();
  }

  solveProblemOnClick(problemName) {
    this.router.navigate(['/problems/'+problemName]);
  }

  getProblemSuccessRate() {
    this.problemService.getProblemSuccessRate(this.problem._id).subscribe(data => {
      this.problemSuccessRate = (data.successRate || 0) * 100;
    });
  }

}
