import { Query } from './query';
import { parseMetadata, parseInnerHits } from './query-parser';
import { id } from './util';

export function parse(query: Object, parseChild: (child: Object) => Query): Query {
  const path: string = query['path'];
  const nestedQuery = parseChild(query['query']);
  const metadata = parseMetadata(query);
  const innerHits = parseInnerHits(query);
  return create(path, nestedQuery, metadata, innerHits);
}

function create(path: string, query: Query, metadata?: any[], innerHits?: any[]) {
  return {
    id: id(),
    name: `has item at <code>${path}</code> that` + (query.type === 'bool' ? '' : ' satisfies'),
    type: 'nested',
    children: [query],
    metadata: metadata,
    innerHits: innerHits,
    isExpanded: true
  };
}
