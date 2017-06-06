import { Component, OnInit , Input , ViewChild , ElementRef } from '@angular/core';
import { ProblemService } from '../../services/problem.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ActivatedRoute,Router } from '@angular/router';
import {MathjaxDirective} from '../../directives/mathjax.directive';

declare var CodeMirror: any;

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {
  @ViewChild('EditorCode') el:ElementRef;
  @ViewChild('hi') eel:ElementRef;
    public isCollapsed:boolean = true;
  nameProblem : string;
  problem : any;
  user: any;
  editor : any;
  fractionString: string = 'Inside Angular one half = $\\frac 12$';
  themes = ["default",
  "eclipse",
  "monokai",
  "neat",
  "neo",];
  selection  = this.themes[0];
  private testPassed: number;
  private barType: string;
  private sampleTest: any;
  constructor(
    private problemService : ProblemService,
    private authService : AuthService,
    private flashMesssagesService : FlashMessagesService,
    private route : ActivatedRoute,
    private router : Router
  ) {
  }
  ngAfterViewInit() {
    this.sampleTest = [];
    var value = "// The bindings defined specifically in the Sublime Text mode\nvar bindings = {\n";
    var map = CodeMirror.keyMap.sublime;
    for (var key in map) {
      var val = map[key];
      if (key != "fallthrough" && val != "..." && (!/find/.test(val) || /findUnder/.test(val)))
        value += "  \"" + key + "\": \"" + val + "\",\n";
    }
    value += "}\n\n// The implementation of joinLines\n";
    value += CodeMirror.commands.joinLines.toString().replace(/^function\s*\(/, "function joinLines(").replace(/\n  /g, "\n") + "\n";

     this.editor = CodeMirror(document.getElementById("codeeditor"),{
       value : '#include <iostream>\n\nusing namespace std;\n\nint main() {\n\treturn 0;\n}',
       lineNumbers: true,
       matchBrackets: true,
       autoCloseBrackets: true,
       showCursorWhenSelecting: true,
       mode: "text/x-c++src",
       keyMap: "sublime",
       tabSize: 2
     });
     CodeMirror(document.getElementById("inputEditor"));
  }

  ngOnInit() {
    this.testPassed = 7.0; // TODO - chage to judge response.
    this.barType = "danger";
    this.route.params.subscribe( params => {
      this.nameProblem = params['name'];
    });
    this.problemService.getProblem(this.nameProblem).subscribe(query =>{
      this.problem = query;
      this.problem.description = this.problem.description || {};
      if(this.problem.description.samples === undefined) this.problem.description.samples = [];
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
        timeout : 1000
      });
      return false;
    });
  }

  convertString( code ){
    var res : string ;
    res = "";
    for( var c in code )
    {
      if( code[c] == '\"' )
        res += "\\\"";
      else if( code[ c ] == '\\' )
        res += "\\\\";
      else
        res += ""+code[c];
    }
    return res;
  }

  calculateScore(total, passed) {
    this.testPassed = (passed / total || 0.0) * 100;
    if(this.testPassed === Number.POSITIVE_INFINITY) this.testPassed = 0.0;
    this.testPassed = Math.round(this.testPassed);
    if(this.testPassed <=  40.0) this.barType = "danger";
    else if(this.testPassed > 40.0 && this.testPassed < 60.0) this.barType = "warning";
    else if(this.testPassed >= 60.0) this.barType = "success";
    console.log(this.barType);
  }

  onSubmissionSubmit(){
    if( !this.authService.loggedIn() ){
      this.router.navigate(['/']);
      return false;
    }
    const submission = {
      source_code : this.convertString(this.editor.getValue()),
      userId : this.user._id,
      problemId : this.problem._id,
      sample : false
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
          timeout : 1000
        });
        this.flashMesssagesService.show(data.submission.veredict,{
          cssClass : 'alert-info',
          timeout : 1000
        });
        this.calculateScore(data.data.totalCases, data.data.totalAC);
      }
      else{
        this.flashMesssagesService.show(data.err.message,{
          cssClass : 'alert-danger',
          timeout : 3000
        });
      }
    });
  }
  selectionChange(){
    this.editor.setOption("theme", this.selection);
    location.hash = "#" + this.selection;
  }

  runCodeOnClick() {
    var dummySample = {
      input: "1234",
      user_output: "User Out",
      expected_output: "Expected Out",
      veredict: "Judging…",
      outcome: 1
    };
    console.log(this.sampleTest);
    const submission = {
      source_code : this.convertString(this.editor.getValue()),
      userId : this.user._id,
      problemId : this.problem._id,
      sample : true
    };
    this.problemService.submitSubmission(submission).subscribe(data => {
      console.log("Data");
      console.log(data);
      var len = data.submission.genOut.length;
      this.sampleTest = [];
      for( var i = 0; i < len ; ++i ) {
        this.sampleTest.push({
          veredict : data.submission.testsResults[i],
          user_output : data.submission.genOut[i],
          expected_output : this.problem.description.samples[i][1],
          input : this.problem.description.samples[i][0],
          tittle : i
        })
      }
      console.log(this.sampleTest);
    });
  }

  public collapsed(event:any):void {
  }

  public expanded(event:any):void {
  }
}
