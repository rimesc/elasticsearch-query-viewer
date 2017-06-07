import { Query } from './query';
import { parseMetadata } from './query-parser';

export function parse(query: Object, parseChild: (child: Object) => Query): Query {
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
  return create(field, value, metadata);
}

function create(field: string, value: string, metadata?: any): Query {
  return {
    id: field,
    type: 'match',
    name: `'${field}' matches '${value}'`,
    children: [],
    metadata: metadata,
    isExpanded: false
  };
}
