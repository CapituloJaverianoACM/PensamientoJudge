import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProblemService } from '../../services/problem.service'
import {MathjaxDirective} from '../../directives/mathjax.directive';

declare var CodeMirror: any;

@Component({
  selector: 'app-admin-problem-edit',
  templateUrl: './admin-problem-edit.component.html',
  styleUrls: ['./admin-problem-edit.component.css']
})
export class AdminProblemEditComponent implements OnInit {
  @ViewChild('EditorCode') el:ElementRef;
  private nameProblem: string;
  private problem: any;
  private samples : any;
  private emptyString: string;
  private codeEditor: any;
  private editorConfig: any;
  private difficulties = ["Facil", "Intermedio", "Complejo"];
  private problemTheme = ["Condicionales", "Ciclos", "Ciclos Anidados",
                          "Matematica", "Cadenas de Caracteres", "Funciones",
                          "Arreglos", "Matrices", "Funciones Con Arreglos",
                          "Funciones Con Matrices", "Aritmetica Modular"
                         ];

  constructor(
    private route: ActivatedRoute,
    private problemService: ProblemService,
    private router: Router
  ) {}

  ngOnInit() {
    this.problemTheme.sort();
    var value = "// The bindings defined specifically in the Sublime Text mode\nvar bindings = {\n";
    var map = CodeMirror.keyMap.sublime;
    for (var key in map) {
      var val = map[key];
      if (key != "fallthrough" && val != "..." && (!/find/.test(val) || /findUnder/.test(val)))
        value += "  \"" + key + "\": \"" + val + "\",\n";
    }
    value += "}\n\n// The implementation of joinLines\n";
    value += CodeMirror.commands.joinLines.toString().replace(/^function\s*\(/, "function joinLines(").replace(/\n  /g, "\n") + "\n";
    this.route.params.subscribe(params => {
      this.nameProblem = params['problemName']; // (+) converts string 'id' to a number
      this.problemService.getProblem(this.nameProblem).subscribe(
        (query) => {
          this.problem = query;
          this.problem.difficulty = this.problem.difficulty || this.difficulties[0];
          this.problem.time_limit = this.problem.time_limit || 1;
          this.problem.description = this.problem.description || {};
          if(this.problem.description.samples === undefined) this.problem.description.samples = [];
          this.codeEditor = CodeMirror(
            document.getElementById("codeeditor"),{
              value : this.problem.template || '#include <iostream>\n\nusing namespace std;\n\nint main() {\n\treturn 0;\n}',
              lineNumbers: true,
              matchBrackets: true,
              autoCloseBrackets: true,
              showCursorWhenSelecting: true,
              mode: "text/x-c++src",
              keyMap: "sublime",
              tabSize: 2
            });
        }
      );
    });
  }

  addSampleOnClick() {
    var newCase = ["",""];
    this.problem.description.samples.push(newCase);
  }

  removeSampleOnClick(sample) {
    var toDeleteIndex = this.problem.description.samples.indexOf(sample);
    this.problem.description.samples.splice(toDeleteIndex, 1);
  }

  saveChangesOnClick() {
    this.problem.template = this.codeEditor.getValue();
    this.problemService.updateProblem(this.problem).subscribe(data =>{
      this.backToProblems();
    });
  }

  cancelOnClick(){
    this.backToProblems();
  }

  backToProblems(){
    this.router.navigate(['/admin','problems']);
  }

  addTestCasesOnClick() {
    this.router.navigate(['/admin','problems',this.problem.name, 'testCases']);
  }

}
