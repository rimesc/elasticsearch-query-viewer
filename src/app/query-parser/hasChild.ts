import { Query } from './query';
import { parseMetadata, parseInnerHits } from './query-parser';
import { id } from './util';

export function parse(query: Object, parseChild: (child: Object) => Query): Query {
  const type = query['type'];
  if (!type) {
    throw SyntaxError('Malformed has_child query: missing member \'type\'');
  }
  const childQuery = query['query'];
  if (!childQuery) {
    throw SyntaxError('Malformed has_child query: missing member \'query\'');
  }
  const metadata = parseMetadata(query);
  const innerHits = parseInnerHits(query);
  return create(type, parseChild(childQuery), metadata, innerHits);
}

function create(type: string, childQuery: Query, metadata?: any[], innerHits?: any[]): Query {
  return {
    id: id(),
    name: `has a child of type <code>${type}</code> that` + (childQuery.type === 'bool' ? '' : ' satisfies'),
    type: 'has_child',
    children: [childQuery],
    metadata: metadata,
    innerHits: innerHits,
    isExpanded: true
  };
}
