import { Query } from './query';
import { parseMetadata } from './query-parser';
import { id } from './util';

export function parse(query: Object, parseChild: (child: Object) => Query): Query {
  const path: string = query['path'];
  const nestedQuery = parseChild(query['query']);
  const metadata = parseMetadata(query);
  return create(path, nestedQuery, metadata);
}

function create(path: string, query: Query, metadata?: any) {
  return {
    id: id(),
    name: `has item at <code>${path}</code> that` + (query.type === 'bool' ? '' : ' satisfies'),
    type: 'nested',
    children: [query],
    metadata: metadata,
    isExpanded: true
  };
}
