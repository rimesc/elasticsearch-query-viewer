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

export function term(field: string, value: string, metadata?: any): Query {
  return {
    id: field,
    type: 'term',
    name: `'${field}' contains '${value}'`,
    children: [],
    metadata: metadata,
    isExpanded: false
  };
}

interface Bound { value: number; exclusive: boolean; }

export function range(field: string, lower: Bound, upper: Bound, metadata?: any): Query {
  let name: string;
  if (!upper) {
    name = `'${field}' greater than ${lower.exclusive ? '' : 'or equal to '}'${lower.value}'`;
  } else if (!lower) {
    name = `'${field}' less than ${upper.exclusive ? '' : 'or equal to '}'${upper.value}'`;
  } else {
    name = `'${field}' between '${lower .value}' ${lower.exclusive ? '(exclusive) ' : '(inclusive) '}
            and '${upper.value}' ${upper.exclusive ? '(exclusive) ' : '(inclusive) '}`;
  }
  return {
    id: field,
    type: 'range',
    name: name,
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
