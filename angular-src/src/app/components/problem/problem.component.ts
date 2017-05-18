import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tab } from '../tab/tab.component';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css'],
})
export class ProblemComponent implements OnInit, OnDestroy {
  name: string;
  private sub: any;
  update: boolean;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.name = params['name']; // (+) converts string 'id' to a number
    this.update = false;
       // In a real app: dispatch action to load the details here.
    });
  }
  onUpdate(selectedTab:Tab){
    // console.log(selectedTab.tabTitle);
    if( selectedTab.tabTitle == "Submissions" )
      this.update = true;
    else
      this.update = false;
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
