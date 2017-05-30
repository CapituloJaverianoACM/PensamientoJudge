import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { LocalDataSource,ViewCell } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { ProblemService } from '../../services/problem.service';



@Component({
  selector: 'app-admin-problem',
  templateUrl: './admin-problem.component.html',
  styleUrls: ['./admin-problem.component.css']
})
export class AdminProblemComponent implements OnInit {
  constructor() {}

  ngOnInit() {
  }

}
