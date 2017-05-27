import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-query-input',
  templateUrl: './query-input.component.html',
  styleUrls: ['./query-input.component.css']
})
export class QueryInputComponent {

  @Output()
  modified = new EventEmitter<any>();

  error: string;

  set queryText(queryText: string) {
    if (queryText.trim()) {
      try {
        const query = JSON.parse(queryText);
        this.error = null;
        this.modified.emit(query);
      } catch (error) {
        if (error instanceof SyntaxError) {
          this.error = error.message;
        }
      }
    } else {
      this.modified.emit(null);
      this.error = null;
    }
  }

}
