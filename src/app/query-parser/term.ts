import { Query } from './query';
import { parseMetadata } from './query-parser';
import { id } from './util';

export function parse(query: Object, parseChild: (child: Object) => Query): Query {
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
  return create(field, value, metadata);
}

function create(field: string, value: string, metadata?: any[]): Query {
  return {
    id: id(),
    type: 'term',
    name: `<code>${field}</code> contains <q>${value}</q>`,
    children: [],
    metadata: metadata,
    isExpanded: false
  };
}
