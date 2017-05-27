import { Component, Input } from '@angular/core';

import { TreeNode } from 'angular-tree-component';

import { parseQuery } from '../query-parser/query-parser';

@Component({
  selector: 'app-query-tree',
  templateUrl: './query-tree.component.html',
  styleUrls: ['./query-tree.component.css']
})
export class QueryTreeComponent {

  nodes: any[];

  @Input()
  set query(query: any) {
    this.nodes = parseQuery(query);
  }

}
