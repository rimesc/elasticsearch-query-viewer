import { match, term, range, bool, must, should, mustNot, nested, Query } from './node';

export function parse(query: Object): Query {
  if (query instanceof Object && query.hasOwnProperty('query')) {
    return parseQuery(query['query']);
  } else {
    return parseQuery(query);
  }
}

function parseQuery(query: Object): Query {
  // a query should only have a single child
  const queryType = Object.getOwnPropertyNames(query)[0];
  switch (queryType) {
    case 'match':
      return parseMatch(query['match']);
    case 'term':
      return parseTerm(query['term']);
    case 'range':
      return parseRange(query['range']);
    case 'bool':
      return parseBool(query['bool']);
    case 'nested':
      return parseNested(query['nested']);
    default:
      console.log(`Ignoring unsupported clause of type ${queryType}`);
      return null;
  }
}

function parseNested(query: Object): Query {
  const path: string = query['path'];
  const nestedQuery = parseQuery(query['query']);
  return nested(path, nestedQuery);
}

function parseBool(query: Object): Query {
  const subClauses = Object.getOwnPropertyNames(query).map((prop, i) => {
    switch (prop) {
      case 'must':
        return must(parseBoolClauses(query[prop]));
      case 'should':
        return should(parseBoolClauses(query[prop]), minimumShouldMatch(query));
      case 'must_not':
        return mustNot(parseBoolClauses(query[prop]));
      case 'filter':
      default:
        return null;
    }
  }).filter(x => x);
  return bool(subClauses);
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

function parseBoolClauses(clauses: Object): Query[] {
  if (clauses instanceof Array) {
    return (clauses as Object[]).map((clause, i) => parseQuery(clause, i)).filter(x => x);
  } else {
    return [];
  }
}

function flatten(a: Object[], b: Object[]): Object[] {
  return a.concat(b);
}

function parseMatch(query: Object): Query {
  const field = Object.getOwnPropertyNames(query)[0];
  let value: string;
  let metadata = null;
  if (field && typeof query[field] === 'string') {
    value = query[field];
  } else if (field && query[field].hasOwnProperty('query')) {
    value = query[field]['query'];
    metadata = parseMetadata(query[field]);
  } else {
    throw SyntaxError('Malformed match clause');
  }
  return match(field, value, metadata);
}

function parseTerm(query: Object): Query {
  const field = Object.getOwnPropertyNames(query)[0];
  let value: string;
  let metadata = null;
  if (field && typeof query[field] === 'string') {
    value = query[field];
  } else if (field && query[field].hasOwnProperty('value')) {
    value = query[field]['value'];
    metadata = parseMetadata(query[field]);
  } else {
    throw SyntaxError('Malformed term clause');
  }
  return term(field, value, metadata);
}

function parseRange(query: Object): Query {
  const field = Object.getOwnPropertyNames(query)[0];
  const lt: number = query[field]['lt'];
  const lte: number = query[field]['lte'];
  const gt: number = query[field]['gt'];
  const gte: number = query[field]['gte'];
  const metadata = parseMetadata(query[field]);
  const lower = gt ? { value: gt, exclusive: true} : gte ? { value: gte, exclusive: false } : null;
  const upper = lt ? { value: lt, exclusive: true} : lte ? { value: lte, exclusive: false } : null;
  return range(field, lower, upper, metadata);
}

function parseMetadata(query: Object) {
  const props = Object.getOwnPropertyNames(query).filter(k => !(query[k] instanceof Object)).map(k => ({key: k, value: query[k]}));
  return props.length === 0 ? null : props;
}

  // if (query instanceof Array) {
  //   return query.map((item, i) => {
  //     const id = parent + '.' + i;
  //     return {
  //       id: id,
  //       name: i,
  //       isExpanded: true,
  //       children: parseQuery(item, id)
  //     };
  //   });
  // } else if (query instanceof Object) {
  //   return Object.getOwnPropertyNames(query).map((prop, i) => {
  //     const id = parent + '.' + i;
  //     return {
  //       id: id,
  //       name: prop,
  //       isExpanded: true,
  //       children: parseQuery(query[prop], id)
  //     };
  //   });
  // } else {
  //   return [];
  // }
