import { Component, Output, EventEmitter, OnInit } from '@angular/core';

const example = `{
  "query": {
    "nested": {
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "foo.A": "a"
              }
            }
          ],
          "should": [
            {
              "match": {
                "foo.B": "b"
              }
            },
            {
              "match": {
                "foo.C": "c"
              }
            }
          ],
          "must_not": [
            {
              "match": {
                "foo.D": "d"
              }
            }
          ],
          "minimum_should_match": 1
        }
      },
      "path": "foo"
    }
  }
}`;

@Component({
  selector: 'app-query-input',
  templateUrl: './query-input.component.html',
  styleUrls: ['./query-input.component.scss']
})
export class QueryInputComponent implements OnInit {

  @Output()
  modified = new EventEmitter<any>(true);

  error: string;

  private value: string;

  ngOnInit() {
    this.queryText = example; // TODO remove me
  }

  get queryText() {
    return this.value;
  }

  set queryText(queryText: string) {
    this.value = queryText;
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
