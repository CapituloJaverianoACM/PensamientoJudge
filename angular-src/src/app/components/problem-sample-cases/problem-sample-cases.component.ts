import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-problem-sample-cases',
  templateUrl: './problem-sample-cases.component.html',
  styleUrls: ['./problem-sample-cases.component.css']
})
export class ProblemSampleCasesComponent implements OnInit {

/*
var dummySample = {
  input: "1234",
  user_output: "User Out",
  expected_output: "Expected Out",
  veredict: "Test Veredict",
  outcome: 1
};
*/

  @Input() sampleCase: any;

  private problemPassInfo: string;

  constructor() { }

  ngOnInit() {
  }

}
