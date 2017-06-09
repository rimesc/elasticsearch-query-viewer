import { Query } from './query';
import { parseMetadata } from './query-parser';
import { id } from './util';

export function parse(query: Object, parseChild: (child: Object) => Query): Query {
  const field = query['field'];
  if (!field) {
    throw SyntaxError('Malformed exists query: missing member \'field\'');
  }
  const metadata = parseMetadata(query);
  return create(field, metadata);
}

function create(field: string, metadata?: any): Query {
  return {
    id: id(),
    type: 'exists',
    name: `has a value for <code>${field}</code>`,
    children: [],
    metadata: metadata,
    isExpanded: false
  };
}

