export interface Query {
  id: string;
  type?: string;
  name: string;
  children: Query[];
  metadata?: any;
  isExpanded: boolean;
}

export function match(field: string, value: string, metadata?: any): Query {
  return {
    id: field,
    type: 'match',
    name: `'${field}' matches '${value}'`,
    children: [],
    metadata: metadata,
    isExpanded: false
  };
}

export function bool(children: Query[], metadata?: any): Query {
  return {
    id: 'bool',
    name: 'satisfies',
    type: 'bool',
    children: children,
    metadata: metadata,
    isExpanded: true
  };
}

export function must(children: Query[]) {
  return {
    id: 'must',
    name: 'all of',
    type: 'must',
    children: children,
    isExpanded: true
  };
}

export function should(children: Query[], minimumShouldMatch: number) {
  return {
    id: 'should',
    name: (minimumShouldMatch > 0) ? `at least ${minimumShouldMatch} of` : 'preferably',
    type: 'should',
    children: children,
    isExpanded: true
  };
}

export function mustNot(children: Query[]) {
  return {
    id: 'must_not',
    name: 'none of',
    type: 'must_not',
    children: children,
    isExpanded: true
  };
}

export function nested(path: string, query: Query, metadata?: any) {
  return {
    id: 'nested',
    name: `has item at '${path}' that`,
    type: 'nested',
    children: [query],
    metadata: metadata,
    isExpanded: true
  };
}
