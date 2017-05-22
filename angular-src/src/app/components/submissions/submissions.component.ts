import { Component, OnInit , Input } from '@angular/core';
import { ProblemService } from '../../services/problem.service';
import { AuthService } from '../../services/auth.service';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css'],
})
export class SubmissionsComponent implements OnInit {
  @Input() nameProblem;
  @Input() update;
  user : any;
  submissions : any;
  settings = {
    columns: {
      id : {
        title: 'Id',
        editable: false,
        filter : false
      },
      username: {
        title: 'User Name',
        editable: false,
        filter : false
      },
      problemName:{
        title: 'Problem Name',
        editable: false,
        filter : false
      },
      veredict: {
        title: 'Veredict',
        editable: false,
        filter : false
      }
    },
    actions : false,
    filter : false,
    hideSubHeader : true
  };
  data : LocalDataSource ;

  constructor(
    private problemService : ProblemService,
    private authService : AuthService
  ) { }

  ngOnInit() {
    this.data = new LocalDataSource();
    this.problemService.getSubmissionsUser(this.nameProblem).subscribe( query =>{
      this.submissions = query;
      this.authService.getProfile().subscribe(profile =>{
        this.user = profile.user;
        var len = this.submissions.length;
        var arr = [];
        for( var i = 0 ; i < len ; ++i  ){
          arr.push( {
            id : this.submissions[ i ]._id,
            username: this.user.username,
            problemName: this.nameProblem,
            veredict : this.submissions[ i ].veredict
          } );
        }
        this.data.load(arr);
        // console.log(this.data);
      }, err => {
        console.log(err);

        return false;
      });
    }, err =>{
      console.log(err);
      return false;
    });
    // console.log(this.submissions);
    // this.submissions = Object.keys(json ).map(function(_) { return json[_]; });
  }
  onUpdate(){
    this.problemService.getSubmissionsUser(this.nameProblem).subscribe( query =>{
      this.submissions = query;
        var len = this.submissions.length;
        var arr = [];
        for( var i = 0 ; i < len ; ++i  ){
          arr.push( {
            id : this.submissions[ i ]._id,
            username: this.user.username,
            problemName: this.nameProblem,
            veredict : this.submissions[ i ].veredict
          } );
        }
        this.data.load(arr);
    }, err =>{
      console.log(err);
      return false;
    });
  }
  ngDoCheck(){
    // console.log(this.update);
    if( this.update )
    {
      // console.log("update");
      this.onUpdate();
      this.update = false;
    }
  }
}
