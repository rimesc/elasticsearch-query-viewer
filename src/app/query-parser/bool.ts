import { Query } from './query';
import { parseMetadata } from './query-parser';
import { id } from './util';

export function parse(query: Object, parseChild: (child: Object) => Query): Query {
  const subClauses = Object.getOwnPropertyNames(query).map((prop, i) => {
    switch (prop) {
      case 'must':
        return must(parseBoolClauses(query[prop], parseChild));
      case 'should':
        return should(parseBoolClauses(query[prop], parseChild), minimumShouldMatch(query));
      case 'must_not':
        return mustNot(parseBoolClauses(query[prop], parseChild));
      case 'filter':
        // TODO support filter
        return { id: prop, type: prop + '?', name: '', children: [], isExpanded: true };
      default:
        return null;
    }
  }).filter(x => x);
  const metadata = parseMetadata(query);
  return bool(subClauses, metadata);
}

function minimumShouldMatch(bool: Object): number {
  if (bool.hasOwnProperty('minimum_should_match')) {
    return +bool['minimum_should_match'];
  } else {
    return ((bool.hasOwnProperty('must') && bool['must'] instanceof Array && bool['must'].length > 0) ||
    (bool.hasOwnProperty('must_not') && bool['must_not'] instanceof Array && bool['must_not'].length > 0) ||
    bool.hasOwnProperty('filter')) ? 0 : 1;
  }
}

function parseBoolClauses(clauses: Object, parseChild: (child: Object) => Query): Query[] {
  if (clauses instanceof Array) {
    return (clauses as Object[]).map((clause, i) => parseChild(clause)).filter(x => x);
  } else if (clauses instanceof Object) {
    return [parseChild(clauses)].filter(x => x);
  }
}

function flatten(a: Object[], b: Object[]): Object[] {
  return a.concat(b);
}

function bool(children: Query[], metadata?: any): Query {
  return {
    id: id(),
    name: 'satisfies',
    type: 'bool',
    children: children,
    metadata: metadata,
    isExpanded: true
  };
}

function must(children: Query[]) {
  return {
    id: id(),
    name: 'all of',
    type: 'must',
    children: children,
    isExpanded: true
  };
}

function should(children: Query[], minimumShouldMatch: number) {
  return {
    id: id(),
    name: (minimumShouldMatch > 0) ? `at least ${minimumShouldMatch} of` : 'zero or more of',
    type: 'should',
    children: children,
    isExpanded: true
  };
}

function mustNot(children: Query[]) {
  return {
    id: id(),
    name: 'none of',
    type: 'must_not',
    children: children,
    isExpanded: true
  };
}
