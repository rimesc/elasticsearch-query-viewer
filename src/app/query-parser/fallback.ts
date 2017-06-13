import { Query } from './query';
import { parseMetadata } from './query-parser';
import { id } from './util';

export function parse(queryType: string, query: Object, parseChild: (child: Object) => Query): Query {
  const metadata = parseMetadata(query);
  if (query.hasOwnProperty('query')) {
      return create(queryType, parseChild(query['query']), metadata);
  }
  if (query.hasOwnProperty('filter')) {
      return create(queryType, parseChild(query['filter']), metadata);
  }
  return create(queryType, null, metadata);
}

function create(queryType: string, child?: any, metadata?: any[]): Query {
  return {
    id: id(),
    type: queryType,
    name: '',
    children: child ? [child] : [],
    metadata: metadata,
    isExpanded: true
  };
}

