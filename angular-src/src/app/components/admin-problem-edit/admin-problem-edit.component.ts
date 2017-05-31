import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProblemService } from '../../services/problem.service'
import {MathjaxDirective} from '../../directives/mathjax.directive';


@Component({
  selector: 'app-admin-problem-edit',
  templateUrl: './admin-problem-edit.component.html',
  styleUrls: ['./admin-problem-edit.component.css']
})
export class AdminProblemEditComponent implements OnInit {

  nameProblem: string;
  problem: any;
  samples : any;

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
        }
      );
    });
  }

  addSampleOnClick() {
    var newCase = ["",""];
    this.problem.description.samples.push(newCase);
  }

  removeSampleOnClick(sample) {
    var toDeleteIndex = this.problem.description.samples.indexOf(sample);
    this.problem.description.samples.splice(toDeleteIndex, 1);
  }

  saveChangesOnClick() {
    this.problemService.updateProblem(this.problem).subscribe(data =>{});
    this.problemService.getProblem(this.nameProblem).subscribe(
      (query) => {
        this.problem = query;
      }
    );
  }

}
