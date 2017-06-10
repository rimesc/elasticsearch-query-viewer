import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-query-input',
  templateUrl: './query-input.component.html',
  styleUrls: ['./query-input.component.scss']
})
export class QueryInputComponent {

  @Output()
  modified = new EventEmitter<any>(true);

  error: string;

  private value = '';

  get queryText() {
    return this.value;
  }

  set queryText(queryText: string) {
    this.value = queryText;
    if (queryText && queryText.trim()) {
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
