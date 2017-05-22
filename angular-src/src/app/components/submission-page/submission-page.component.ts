import { Component, OnInit } from '@angular/core';
import { ProblemService } from '../../services/problem.service';
import { AuthService } from '../../services/auth.service';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-submission-page',
  templateUrl: './submission-page.component.html',
  styleUrls: ['./submission-page.component.css']
})
export class SubmissionPageComponent implements OnInit {

  user: any;
  submissions: any;
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
  }
  data : LocalDataSource;
  constructor(
    private problemService : ProblemService,
    private authService : AuthService
  ) { }

  ngOnInit() {
    this.data = new LocalDataSource();
    this.problemService.getAllSubmissionsUser().subscribe( query => {
      console.log(query);
      var len = query.length;
      var arr = [];
      for( var i = 0 ; i < len ; ++i ){
        arr.push({
          id : query[ i ]._id,
          username : query[ i ].user[ 0 ].username,
          problemName: query[ i ].problem[ 0 ].name,
          veredict: query[ i ].veredict
        });
      }
      this.data.load(arr);
      this.submissions = query;
    }, err => {
      console.log(err);
      return false;
    });
  }

}
