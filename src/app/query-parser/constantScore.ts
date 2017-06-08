import { Query } from './query';
import { parseMetadata } from './query-parser';
import { id } from './util';

export function parse(query: Object, parseChild: (child: Object) => Query): Query {
  const filter = query['filter'];
  if (!filter) {
    throw SyntaxError('Malformed constant_score query: missing member \'filter\'');
  }
  const metadata = parseMetadata(query);
  return create(parseChild(filter), metadata);
}

function create(filterQuery: Query, metadata?: any): Query {
  return {
    id: id(),
    name: 'filtered by',
    type: 'constant_score',
    children: [filterQuery],
    metadata: metadata,
    isExpanded: true
  };
}
