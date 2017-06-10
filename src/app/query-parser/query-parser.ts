import { Query } from './query';
import { parse as parseBool } from './bool';
import { parse as parseConstantScore } from './constantScore';
import { parse as parseExists } from './exists';
import { parse as parseHasChild } from './hasChild';
import { parse as parseHasParent } from './hasParent';
import { parse as parseMatch } from './match';
import { parse as parseNested } from './nested';
import { parse as parseRange } from './range';
import { parse as parseTerm } from './term';

const parsers = {
  bool: parseBool,
  constant_score: parseConstantScore,
  exists: parseExists,
  has_child: parseHasChild,
  has_parent: parseHasParent,
  match: parseMatch,
  nested: parseNested,
  range: parseRange,
  term: parseTerm
};

/**
 * Parses a query or part of a query into a structural tree.
 * @param query The query clause.
 */
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
  const parser: (query: Object, parseChild: (query: Object) => Query) => Query = parsers[queryType];
  if (parser) {
    return parser(query[queryType], parseQuery);
  } else if (query[queryType] instanceof Object) {
    console.log(`Ignoring unsupported clause of type ${queryType}`);
    return { id: queryType, type: queryType + '?', name: '', children: [], isExpanded: true };
  } else {
    return null;
  }
}

/**
 * Extracts metadata from a query clause. The metadata is a list of key value pairs containing
 * all the primitive-valued members of the query clause.
 * @param query The query clause.
 */
export function parseMetadata(query: Object): { key: string, value: any }[] {
  const props = Object.getOwnPropertyNames(query).filter(k => !(query[k] instanceof Object)).map(k => ({key: k, value: query[k]}));
  return props.length === 0 ? null : props;
}

/**
 * Extracts inner hits from a query clause. The inner hits is a list of key value pairs containing
 * all the primitive-valued members of the inner hits clause.
 * @param query The query clause.
 */
export function parseInnerHits(query: Object): { key: string, value: string }[] {
  const innerHits = query['inner_hits'];
  return innerHits ? parseMetadata(innerHits) : null;
}
