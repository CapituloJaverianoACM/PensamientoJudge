import { Component, OnInit , Input } from '@angular/core';
import { ProblemService } from '../../services/problem.service';
import { AuthService } from '../../services/auth.service';
import { LocalDataSource } from 'ng2-smart-table';
declare var CodeMirror: any;

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
  // settings = {
  //   columns: {
  //     id : {
  //       title: 'Id',
  //       editable: false,
  //       filter : false
  //     },
  //     username: {
  //       title: 'User Name',
  //       editable: false,
  //       filter : false
  //     },
  //     problemName:{
  //       title: 'Problem Name',
  //       editable: false,
  //       filter : false
  //     },
  //     veredict: {
  //       title: 'Veredict',
  //       editable: false,
  //       filter : false
  //     }
  //   },
  //   actions : false,
  //   filter : false,
  //   hideSubHeader : true
  // };
  // data : LocalDataSource ;
  arr : any;
  pageArr : any;
  itemPerPage = 10;
  totalItems : any;
  constructor(
    private problemService : ProblemService,
    private authService : AuthService
  ) { }

  ngOnInit() {
    // this.data = new LocalDataSource();
    this.problemService.getSubmissionsUser(this.nameProblem).subscribe( query =>{
      this.submissions = query;
      this.authService.getProfile().subscribe(profile =>{
        this.user = profile.user;
        var len = this.totalItems = this.submissions.length;
         this.arr = [];
         var cl;
        for( var i = 0 ; i < len ; ++i  ){
          if( this.submissions[ i ].veredict == 'Accepted' )
            cl = 'accepted';
          else if( this.submissions[ i ].veredict == 'Wrong Answer' )
            cl = 'wrong';
          else if( this.submissions[ i ].veredict == 'Time limit' )
            cl = 'time';
          else if( this.submissions[ i ].veredict == 'Run Time Error' )
            cl = 'runtime';
          else
            cl = 'queue';
          this.arr.push( {
            id : this.submissions[ i ]._id,
            problemName: this.nameProblem,
            veredict : this.submissions[ i ].veredict,
            cl : cl
          } );
        }
        // this.data.load(this.arr);
        // console.log(this.data);
        this.pageArr = [];
        for( var i = 0 ; i < this.itemPerPage && i < len ; ++i )
        {
          this.pageArr.push( this.arr[ i ] );
        }
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
        var len = this.totalItems = this.submissions.length;
         this.arr = [];
        var cl ;
        for( var i = 0 ; i < len ; ++i  ){
          if( this.submissions[ i ].veredict == 'Accepted' )
            cl = 'accepted';
          else if( this.submissions[ i ].veredict == 'Wrong Answer' )
            cl = 'wrong';
          else if( this.submissions[ i ].veredict == 'Time limit' )
            cl = 'time';
          else if( this.submissions[ i ].veredict == 'Run Time Error' )
            cl = 'runtime';
          else
            cl = 'queue';
          this.arr.push( {
            id : this.submissions[ i ]._id,
            problemName: this.nameProblem,
            veredict : this.submissions[ i ].veredict,
            cl : cl
          } );
        }
        this.pageArr = [];
        for( var i = 0 ; i < this.itemPerPage && i < len ; ++i )
        {
          this.pageArr.push( this.arr[ i ] );
        }
        // this.data.load(this.arr);
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
  public pageChanged(event: any): void {
    // console.log('Page changed to: ' + event.page);
    // console.log('Number items per page: ' + event.itemsPerPage);
    this.pageArr = [];
    for( var i = event.itemsPerPage * (event.page-1) ,  j = 0 ; i < this.totalItems && j < event.itemsPerPage ; ++i , ++j ){
      // console.log(this.arr[ i ] );
      // console.log( i );
      this.pageArr.push( this.arr[ i ] );
    }
  }
  onClickCode( item : any)
  {

    this.problemService.getCode( item.id ).subscribe( code =>{
      // console.log(code);
      console.log(1);
      console.log(document.getElementById("modalEditor"));
      console.log(2);
      console.log(document.getElementById("jajajajj"));
      console.log(3);
      CodeMirror(document.getElementById("modalEditor"),{
        lineNumbers: true,
        value : code,
        mode: "text/x-c++src"
      });
      document.getElementById("titleModal").innerHTML = item.id;
    }, err =>{
      console.log(err);
      return false;
    }
    );
  }
}
