import { Component, OnInit , Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  // @Input() username;
  @Input() update;
  submissions : any;
  arr : any;
  pageArr : any;
  itemPerPage = 10;
  totalItems : any;
  type : any;
  param : any;
  currentPage : number = 0;
  editorModal : any;
  constructor(
    private problemService : ProblemService,
    private authService : AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    if( this.nameProblem )
      this.type = 0;
    else
    {
      this.route.data.subscribe( type => {
        this.type = type
        this.type = this.type.type;
      } );

    }
    this.onUpdate();
    // this.data = new LocalDataSource();
    // console.log(this.submissions);
    // this.submissions = Object.keys(json ).map(function(_) { return json[_]; });
  }
  opt0(){
    this.problemService.getSubmissionsUser(this.nameProblem).subscribe(
      submissions => {
        this.config(submissions);
      }, err =>
      {
        console.log(err);
        return false;
      }
    );
  }
  opt1(){
    this.problemService.getAllSubmissions().subscribe(
      submissions => {
        this.config(submissions);
      }, err =>
      {
        console.log(err);
        return false;
      }
    );
  }
  opt2(){
    this.route.params.subscribe(  params => {


        this.problemService.getAllSubmissionsUser(params['username']).subscribe(
          submissions => {
            this.config(submissions);
          }, err =>
          {
            console.log(err);
            return false;
          }
        );
      }
    );
  }
  opt3(){
    this.route.params.subscribe(  params => {
        this.problemService.getAllSubmissionsProblem(params['problemName']).subscribe(
          submissions => {
            // console.log(params['problemName']);
            this.config(submissions);
          }, err =>
          {
            console.log(err);
            return false;
          }
        );
      }
    );
  }

  onUpdate(){

    if( this.type == 0 )
      this.opt0();
    else if( this.type == 1 )
      this.opt1();
    else if( this.type == 2 )
      this.opt2();
    else if( this.type == 3 )
      this.opt3();
    this.currentPage = 0;
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
      document.getElementById("modalEditor").innerHTML = "";
      CodeMirror(document.getElementById("modalEditor"),{
        value : code,
        lineNumbers: true,
        mode: "text/x-c++src"
      });
      document.getElementById("titleModal").innerHTML = item.id;
    }, err =>{
      console.log(err);
      return false;
    }
    );
  }
  config( query  ){
    this.submissions = query;
      var len = this.totalItems = this.submissions.length;
       this.arr = [];
      var cl ;
      // console.log(query);
      for( var i = 0 ; i < len ; ++i  ){
        if( this.submissions[ i ].veredict == 'Accepted' )
          cl = 'accepted';
        else if( this.submissions[ i ].veredict == 'Wrong Answer' )
          cl = 'wrong';
        else if( this.submissions[ i ].veredict == 'Time limit' )
          cl = 'time';
        else if( this.submissions[ i ].veredict == 'Run Time Error' )
          cl = 'runtime';
        else if( this.submissions[ i ].veredict == 'Compilation Error' )
          cl = 'compile'
        else
          cl = 'queue';
        this.arr.push( {
          id : this.submissions[ i ]._id,
          problemName:  this.submissions[ i ].problem[ 0 ].name,
          username : this.submissions[ i ].user[ 0 ].username,
          veredict : this.submissions[ i ].veredict,
          cl : cl
        } );
      }
      this.pageArr = [];
      for( var i = 0 ; i < this.itemPerPage && i < len ; ++i )
      {
        this.pageArr.push( this.arr[ i ] );
      }
  }
}
