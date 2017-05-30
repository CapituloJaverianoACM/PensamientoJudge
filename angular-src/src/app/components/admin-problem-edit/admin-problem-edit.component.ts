import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProblemService } from '../../services/problem.service'


@Component({
  selector: 'app-admin-problem-edit',
  templateUrl: './admin-problem-edit.component.html',
  styleUrls: ['./admin-problem-edit.component.css']
})
export class AdminProblemEditComponent implements OnInit {

  nameProblem: string;
  problem: any;

  constructor(
    private route: ActivatedRoute,
    private problemService: ProblemService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.nameProblem = params['problemName']; // (+) converts string 'id' to a number
      this.problemService.getProblem(this.nameProblem).subscribe(
        (query) => {
          this.problem = query;
          console.log(query);
        }
      );
      // In a real app: dispatch action to load the details here.
    });
  }

}
