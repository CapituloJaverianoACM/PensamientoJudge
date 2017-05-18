import { Component, OnInit , Input , ViewChild , ElementRef } from '@angular/core';
import { ProblemService } from '../../services/problem.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

declare var CodeMirror: any;

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {
  @ViewChild('EditorCode') el:ElementRef;
  @ViewChild('hi') eel:ElementRef;
  @Input() nameProblem;
  problem : any;
  user: any;
  // dir : string;
  editor : any;
  themes = ["default",
  "3024-day",
  "3024-night",
  "abcdef",
  "ambiance",
  "base16-dark",
  "base16-light",
  "bespin",
  "blackboard",
  "cobalt",
  "colorforth",
  "dracula",
  "duotone-dark",
  "duotone-light",
  "eclipse",
  "elegant",
  "erlang-dark",
  "hopscotch",
  "icecoder",
  "isotope",
  "lesser-dark",
  "liquibyte",
  "material",
  "mbo",
  "mdn-like",
  "midnight",
  "monokai",
  "neat",
  "neo",
  "night",
  "panda-syntax",
  "paraiso-dark",
  "paraiso-light",
  "pastel-on-dark",
  "railscasts",
  "rubyblue",
  "seti",
  "solarized dark",
  "solarized light",
  "the-matrix",
  "tomorrow-night-bright",
  "tomorrow-night-eighties",
  "ttcn",
  "twilight",
  "vibrant-ink",
  "xq-dark",
  "xq-light",
  "yeti",
  "zenburn"];
  selection  = this.themes[0];
  constructor(
    private problemService : ProblemService,
    private authService : AuthService,
    private flashMesssagesService : FlashMessagesService,
    private router : Router
  ) {
    // this.dir = '../../../assets/CodeMirror/';
  }
  ngAfterViewInit() {
    // console.log(document.getElementById('codeeditor'));
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
       value : '#include <iostream>\n\nusing namespace std;\n\nint main()\n{\n	return 0;\n}',
      // value : value,
       lineNumbers: true,
       matchBrackets: true,
       autoCloseBrackets: true,
       showCursorWhenSelecting: true,
       mode: "text/x-c++src",
       keyMap: "sublime"
      //  extraKeys: {"Ctrl-Space": "autocomplete"}
     });
    // console.log(document.getElementById('codeeditor'));
    // console.log(this.editor+'fdsa');
  }

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

  onClick(event){
    this.onSubmissionSubmit();
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

  onSubmissionSubmit(){
    const submission = {
      source_code : this.convertString(this.editor.getValue()),
      userId : this.user._id,
      problemId : this.problem._id
    };
    // console.log(submission.source_code);
    // console.log(this.editor+' fin');
    // console.log(this.editor.getValue());
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
  selectionChange(){
    this.editor.setOption("theme", this.selection);
    location.hash = "#" + this.selection;
  }
}
