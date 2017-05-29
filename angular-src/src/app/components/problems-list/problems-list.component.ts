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
  selected_filter: Number;

  constructor(
    private problemService: ProblemService,
    private authService: AuthService,
    private router : Router
  ) { }

  ngOnInit() {
    this.problemService.getAllProblems().subscribe(
      (query) => {
        this.problems = query;
      }
    );
    this.selected_filter = 0;
  }

  filterProblemsCorteOnClick(corte){
    this.selected_filter = corte;
    if(corte == 0) {
      this.problemService.getAllProblems().subscribe(
        (query) => {
          this.problems = query;
        }
      );
    } else {
      this.problemService.getProblemByCorte(corte).subscribe(
        (query) => {
          this.problems = query;
        }
      );
    }
  }

}
