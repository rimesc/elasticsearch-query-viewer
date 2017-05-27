import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { TreeModule } from 'angular-tree-component';

import { AppComponent } from './app.component';
import { QueryTreeComponent } from './query-tree/query-tree.component';
import { QueryInputComponent } from './query-input/query-input.component';

@NgModule({
  declarations: [
    AppComponent,
    QueryTreeComponent,
    QueryInputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TreeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
