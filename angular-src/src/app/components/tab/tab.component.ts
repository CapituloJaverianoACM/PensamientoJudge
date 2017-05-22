import { Component, Input, OnInit } from '@angular/core';
import { TabsComponent } from 'app/components/tabs/tabs.component';

export interface Tab {
  tabTitle: string;
  selected : boolean;
}

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit , Tab {
  @Input() tabTitle;
  selected : boolean;
  constructor(private tabsComponent: TabsComponent) { }

  ngOnInit() {
    this.tabsComponent.addTab(this);
  }

}
