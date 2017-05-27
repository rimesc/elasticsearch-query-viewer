import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  query: any;

  update(query: any) {
    console.log('updated');
    this.query = query;
  }
}
