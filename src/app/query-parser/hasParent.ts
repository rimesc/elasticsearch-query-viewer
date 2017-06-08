import { Query } from './query';
import { parseMetadata } from './query-parser';
import { id } from './util';

export function parse(query: Object, parseChild: (child: Object) => Query): Query {
  const type = query['parent_type'];
  if (!type) {
    throw SyntaxError('Malformed has_parent query: missing member \'parent_type\'');
  }
  const parentQuery = query['query'];
  if (!parentQuery) {
    throw SyntaxError('Malformed has_parent query: missing member \'query\'');
  }
  const metadata = parseMetadata(query);
  return create(type, parseChild(parentQuery), metadata);
}

function create(type: string, parentQuery: Query, metadata?: any): Query {
  return {
    id: id(),
    name: `has a parent of type '${type}' that satisfies`,
    type: 'has_parent',
    children: [parentQuery],
    metadata: metadata,
    isExpanded: true
  };
}
