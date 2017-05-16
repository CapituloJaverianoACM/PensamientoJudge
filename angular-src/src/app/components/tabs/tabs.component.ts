import { Component, EventEmitter, Output , OnInit } from '@angular/core';
import { Tab } from 'app/components/tab/tab.component'

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {

  tabs: Tab[] = [];
  @Output() selected = new EventEmitter();
  constructor() { }

  addTab(tab:Tab) {
    if (!this.tabs.length) {
      tab.selected = true;
    }
    this.tabs.push(tab);
  }

  selectTab(tab:Tab) {
    this.tabs.map((tab) => {
      tab.selected = false;
    })
    tab.selected = true;
    this.selected.emit({selectedTab: tab});
  }

  ngOnInit() {
  }

}
