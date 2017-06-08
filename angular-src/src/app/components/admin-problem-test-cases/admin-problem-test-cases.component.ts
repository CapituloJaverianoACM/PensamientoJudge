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
  arrNameInput : Array<string> = new Array<string>();
  arrNameOutput : Array<string> = new Array<string>();
  arrPosInput : Array< boolean > = new Array< boolean >();
  arrPosOutput : Array< boolean > = new Array< boolean >();
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

          this.problemService.getTetsCasesInput(this.problem).subscribe( (testCasesInput) => {
            this.problemService.getTetsCasesOutput(this.problem).subscribe( testCasesOutput =>{
              var lenI , lenO ;
              lenI = testCasesInput.length;
              lenO = testCasesOutput.length;
              for( var i = 0 ; i < lenI ; ++i )
              {
                testCasesInput[ i ] = testCasesInput[i].split('.')[0];
              }
              for( var i = 0 ; i < lenO ; ++i )
              {
                testCasesOutput[ i ] = testCasesOutput[i].split('.')[0];
              }
               var j , k  ;
              i = j = k =0;
              while( i < lenI || j < lenO )
              {
                if( j >= lenO || testCasesInput[ i ] < testCasesOutput[ j ] )
                {
                  this.arrNameInput.push( testCasesInput[ i ]  );
                  this.arrNameOutput.push( testCasesInput[ i ]  );
                  this.arrPosInput.push(true);
                  this.arrPosOutput.push(false);
                  ++i;
                }
                else if( i >= lenI || testCasesInput[ i ] > testCasesOutput[ j ] )
                {
                  this.arrNameInput.push( testCasesOutput[ j ]  );
                  this.arrNameOutput.push( testCasesOutput[ j ]  );
                  this.arrPosInput.push(false);
                  this.arrPosOutput.push(true);
                  ++j;
                }
                else{
                  this.arrNameInput.push( testCasesOutput[ j ]  );
                  this.arrNameOutput.push( testCasesOutput[ j ]  );
                  this.arrPosInput.push(true);
                  this.arrPosOutput.push(true);
                  ++i,++j;
                }
                this.arrayTest.push( ++k );
              }
            } );
          });
          this.uploader = new FileUploader({url: this.endPoint.prepEndPoint('problemAPI/testCases/')});
        }
      );
    });
  }
  addTestCaseOnClick(){
    this.arrayTest.push( this.arrayTest.length+1 );
    var idAdd = 0;
    var len = this.arrNameInput.length;
    if( len )
      idAdd = Number(this.arrNameInput[ len-1 ])+1;
    this.arrNameInput.push( idAdd+''  );
    this.arrNameOutput.push( idAdd+'' );
    this.arrPosInput.push(false);
    this.arrPosOutput.push(false);
  }
  submitChangeOnClick()
  {
    // console.log(this.uploader);
    // console.log(this.arrInputDel);
    // console.log(this.arrOutputDel);
    // console.log(this.arrNameInput);
    // console.log(this.arrNameOutput);
    this.uploader.uploadAll();
    for( let name of this.arrInputDel )
      this.problemService.deleteTestCasesInput( this.problem , name+'.in' ).subscribe( data => {
        // console.log(data )
      });
    for( let name of this.arrOutputDel )
      this.problemService.deleteTestCasesOutput( this.problem , name+'.out' ).subscribe( data => {
        // console.log(data )
      });
    this.router.navigate(['/admin']);
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
      var fileType = type?'out':'in';
      var name = this.arrNameInput[index-1]+'.'+fileType;
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
    // console.log(index);
    var nameInput = this.arrNameInput[ index ];
    var nameOutput = this.arrNameOutput[ index ];
    if( this.arrPosInput[index] ) this.arrInputDel.push( nameInput );
    if(this.arrPosOutput[index] ) this.arrOutputDel.push( nameOutput );
    var lenQ = this.uploader.queue.length;
    for( var item = 0 ; item < lenQ ; ++item )
    {
      if( this.uploader.queue[ item ].file.name.split('.')[0] == nameInput )
        this.uploader.queue[ item ].remove();
    }
    this.arrNameInput.splice(index,1);
    this.arrNameOutput.splice(index,1);
    this.arrPosInput.splice(index,1);
    this.arrPosOutput.splice(index,1);
    var len = this.arrayTest.length;
    // this.arrayTest = [];
    // for( var i = 1 ; i < len ; ++i )
    //   this.arrayTest.push( i );
    this.arrayTest.splice( len-1  , 1 );
    document.getElementById((index+1)+'.in').innerHTML =
      '<input type="file"  ng2FileSelect [uploader]="uploader" (change)="changeFile(uploader,number,0)" />';
    document.getElementById((index+1)+'.out').innerHTML =
      '<input type="file"  ng2FileSelect [uploader]="uploader" (change)="changeFile(uploader,number,1)" />';
    // console.log(index);
  }
  downloadFile(data: any){
        var blob = new Blob([data._body], { type: 'plain/text' });
        // console.log(blob);
        var url= window.URL.createObjectURL(blob);
        // console.log(url);
        window.location.href = url;
  }



  dowloadOnClick( index , type )
  {
    var type2 = type?'output':'input';
    var ext = type?'.out':'.in';
    this.problemService.dowloadFile(this.problem,this.arrNameInput[index-1]+ext,type2).subscribe( data => this.downloadFile(data) ),
      err => console.log("Error downloading the file."),
      () => console.log("OK");
    // this.problemService.dowloadFile(this.problem,this.arrNameInput[index-1]+ext,type2).subscribe( data =>  {
    //     console.log(data)
    //   });
  }

}