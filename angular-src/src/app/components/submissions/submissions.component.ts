import { Component, OnInit , Input } from '@angular/core';
import { ProblemService } from '../../services/problem.service';


@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit {
  @Input() nameProblem;
  submissions : any;
  constructor(
    private problemService : ProblemService
  ) { }

  ngOnInit() {
    this.problemService.getSubmissionsUser(this.nameProblem).subscribe( query =>{
        this.submissions = query;
    }, err =>{
      console.log(err);
      return false;
    });
    // console.log(this.submissions);
    // this.submissions = Object.keys(json ).map(function(_) { return json[_]; });
  }

}
