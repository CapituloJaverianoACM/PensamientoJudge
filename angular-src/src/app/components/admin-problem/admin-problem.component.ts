import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { LocalDataSource,ViewCell } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { ProblemService } from '../../services/problem.service';



@Component({
  selector: 'app-admin-problem',
  templateUrl: './admin-problem.component.html',
  styleUrls: ['./admin-problem.component.css']
})
export class AdminProblemComponent implements OnInit {
  private problemArr : any;
  private nameNewProblem : string;
  private problemTaken: boolean;

  constructor(
    private problemService : ProblemService,
    private router: Router
  ) {}

  ngOnInit() {
    this.problemTaken = false;
    this.problemService.getAllProblems().subscribe( data =>{
      this.problemArr = data;
    } );
  }
  deleteProblem( problem )
  {
    this.problemService.deleteProblem(problem).subscribe( data => {
      this.problemArr.splice( this.problemArr.indexOf(problem) , 1 );

    });
  }
  addProblemOnClick(){
    var newProblem = {name: this.nameNewProblem};
    this.problemService.createProblem(newProblem).subscribe(data => {
      console.log(data);
      if(data.success) {
        this.router.navigate(['/admin','problems',this.nameNewProblem]);
        this.problemTaken = true;
      } else {
        this.problemTaken = true;
      }
    });
  }
}
