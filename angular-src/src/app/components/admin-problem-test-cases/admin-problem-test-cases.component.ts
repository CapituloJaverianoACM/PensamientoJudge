import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProblemService } from '../../services/problem.service';
import { FileUploader,FileItem } from 'ng2-file-upload';
import { EndPointService } from '../../services/end-point.service';



@Component({
  selector: 'app-admin-problem-test-cases',
  templateUrl: './admin-problem-test-cases.component.html',
  styleUrls: ['./admin-problem-test-cases.component.css']
})
export class AdminProblemTestCasesComponent implements OnInit {
  problem : any;
  nameProblem : string;
  arrayTest : Array<number> = new Array<number>();
  public uploader: FileUploader;
  arrInputDel : Array< string > = new Array< string > ();
  arrOutputDel : Array< string > = new Array< string > ();
  constructor(
    private route: ActivatedRoute,
    private problemService: ProblemService,
    private router: Router,
    private endPoint: EndPointService

  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.nameProblem = params['problemName']; // (+) converts string 'id' to a number
      this.problemService.getProblem(this.nameProblem).subscribe(
        (query) => {
          this.problem = query;
          this.problem.description = this.problem.description || {};
          if(this.problem.description.samples === undefined) this.problem.description.samples = [];
          // this.arrayTest = [];
          var len = this.problem.description.testCases.length;
          for( var i = 0 ; i < len ; ++i )
          {
            this.arrayTest.push( i+1 );
            if( !this.problem.description.testCases[ i ][ 0 ] )
            {
              var name = this.problem.description.testCases[ i ][ 1 ].split('.')[ 0 ] + ".in";
              this.problem.description.testCases[ i ][ 0 ] = name;
            }
            if( !this.problem.description.testCases[ i ][ 1 ] )
            {
              var name = this.problem.description.testCases[ i ][ 0 ].split('.')[ 0 ] + ".out";
              this.problem.description.testCases[ i ][ 1 ] = name;
            }
          }
          this.uploader = new FileUploader({url: this.endPoint.prepEndPoint('problemAPI/testCases/')});
        }
      );
    });
  }
  addTestCaseOnClick(){
    this.arrayTest.push( this.arrayTest.length+1 );
    var idAdd = 0;
    var len = this.problem.description.testCases.length;
    var testCases = this.problem.description.testCases;
    console.log(this.problem.description.testCases);
    for( var i = len-1 ; i >= 0 ; --i ){
      if( testCases[ i ][ 0 ] ){
        idAdd = Number(testCases[ i ][ 0 ].split('.')[ 0 ])+1;
        break;
      }
      if( testCases[ i ][ 1 ] ){
        idAdd = Number(testCases[ i ][ 1 ].split('.')[ 0 ])+1;
        break;
      }
    }
    this.problem.description.testCases.push( new Array<string> (idAdd+'.in',idAdd+'.out') );
  }
  submitChangeOnClick()
  {
    console.log(this.uploader);
    // this.uploader.uploadAll()
        // this.uploaderOutput.uploadAll();
    // var len = this.uploaderInput.queue.length;
    // var i = 0 ;
    // while( !this.uploaderOutput.isUploading && i < 15)
    // {
    //   ++i;
    //   console.log(this.uploaderInput);
    //   console.log(this.uploaderInput.getNotUploadedItems() );
    //   if( this.uploaderInput.progress == 100 )
    //     console.log("hi")
    //   // if( len && this.uploaderInput.queue[ len -1 ].progress == 100 )
    // }
  }
  changeFile( value : any  , index : number , type : number  ){
    // console.log("jfas");
    // console.log(value)
    // console.log("-----");
    // // console.log(method + " " + index+" "+(index-1));
    var len = value.queue.length;
    if( len && !value.queue[ len -1 ].change)
    {
      // console.log(index-1 + " " + type);
      var name = this.problem.description.testCases[index-1][type];
      // console.log(name);
      value.queue[ len-1 ].file.name = name;
      // value.queue[ len-1 ].file.name_id = ;
      value.queue[ len -1 ].change = true;
      var complement = type?'output':'input';
      value.queue[ len -1 ].url += complement+'/'+this.problem._id;


    }
  }

  deleleCaseOnClick( index : number )
  {
    index--;
    console.log(index);
    console.log(this.problem.description.testCases );
    var nameInput = this.problem.description.testCases[ index ][ 0 ];
    var nameOutput = this.problem.description.testCases[ index ][ 1 ];
    this.arrInputDel.push( nameInput );
    this.arrOutputDel.push( nameOutput );
    for( let item of this.uploader.queue )
    {
      if( item._file.name == nameInput || item._file.name == nameOutput )
        item.remove();
    }
    this.problem.description.testCases.splice(index,1);
    var len = this.arrayTest.length;
    this.arrayTest.splice(len-1,1);
    console.log(index);
    console.log(this.problem.description.testCases );
  }
}
