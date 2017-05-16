import { Component, OnInit , Input } from '@angular/core';
import { ProblemService } from '../../services/problem.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {
  @Input() nameProblem;
  problem : any;
  code : string;
  user: any;
  constructor(
    private problemService : ProblemService,
    private authService : AuthService,
    private flashMesssagesService : FlashMessagesService,
    private router : Router
  ) {  }

  ngOnInit() {
    this.problemService.getProblem(this.nameProblem).subscribe(query =>{
      this.problem = query;
      // console.log(this.problem);
      // console.log(query);
    }, err =>{
      console.log(err);
      return false;
    });
    this.authService.getProfile().subscribe(profile =>{
      this.user = profile.user;
    }, err => {
      console.log(err);

      this.flashMesssagesService.show("Please log in",{
        cssClass : 'alert-danger',
        timeout : 10000
      });
      return false;
    });
  }

  onSubmissionSubmit(){
    const submission = {
      source_code : this.code,
      userId : this.user._id,
      problemId : this.problem._id
    };
    if( !submission.userId ){
      this.flashMesssagesService.show("Please log in",{
        cssClass : 'alert-danger',
        timeout : 3000
      });
      return false;
    }
    this.problemService.submitSubmission(submission).subscribe( data =>{
      if( data.success ){
        console.log(data);
        this.flashMesssagesService.show("submission OK ",{
          cssClass : 'alert-success',
          timeout : 100000

        });
        this.flashMesssagesService.show(data.submission.veredict,{
          cssClass : 'alert-info',
          timeout : 100000

        });
      }
      else{
        this.flashMesssagesService.show(data.err.message,{
          cssClass : 'alert-danger',
          timeout : 3000
        });

      }
    });
  }
}
