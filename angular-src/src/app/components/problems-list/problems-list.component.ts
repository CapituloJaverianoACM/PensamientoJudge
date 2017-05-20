import { Component, OnInit } from '@angular/core';
import { ProblemService } from '../../services/problem.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-problems-list',
  templateUrl: './problems-list.component.html',
  styleUrls: ['./problems-list.component.css']
})
export class ProblemsListComponent implements OnInit {

  problems : any;

  constructor(
    private problemService: ProblemService,
    private authService: AuthService,
    private router : Router
  ) { }

  ngOnInit() {
    this.problemService.getAllProblems().subscribe(
      (query) => {
        this.problems = query;
        console.log(this.problems[0])
      }
    );
  }

  solveProblemOnClick(problemName) {

    this.router.navigate(['/problems/'+problemName]);
  }

}
