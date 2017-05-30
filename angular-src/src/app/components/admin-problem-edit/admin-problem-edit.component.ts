import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-admin-problem-edit',
  templateUrl: './admin-problem-edit.component.html',
  styleUrls: ['./admin-problem-edit.component.css']
})
export class AdminProblemEditComponent implements OnInit {

  name: string;
  problem: any;
  
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
       this.name = params['problemName']; // (+) converts string 'id' to a number
       // In a real app: dispatch action to load the details here.
    });
  }

}
