import { Component, Input, ViewChild } from '@angular/core';

import { TreeNode, TreeComponent } from 'angular-tree-component';

import { parse } from '../query-parser/query-parser';

@Component({
  selector: 'app-query-tree',
  templateUrl: './query-tree.component.html',
  styleUrls: ['./query-tree.component.scss']
})
export class QueryTreeComponent {

  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  nodes: any[];

  error: string;

  @Input()
  set query(query: any) {
    if (query) {
      try {
        const rootNode = parse(query);
        if (rootNode) {
          this.nodes = [rootNode];
          this.error = null;
        }
      } catch (error) {
        this.nodes = null;
        this.error = error;
      }
    }
  }

  expandAll() {
    if (this.tree && this.tree.treeModel) {
      this.tree.treeModel.expandAll();
    }
  }

}
