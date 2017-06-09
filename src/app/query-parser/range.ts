import { Query } from './query';
import { parseMetadata } from './query-parser';
import { id } from './util';

export function parse(query: Object, parseChild: (child: Object) => Query): Query {
  const field = Object.getOwnPropertyNames(query)[0];
  const lt: string = query[field]['lt'];
  const lte: string = query[field]['lte'];
  const gt: string = query[field]['gt'];
  const gte: string = query[field]['gte'];
  const metadata = parseMetadata(query[field]);
  const lower = gt ? { value: gt, exclusive: true} : gte ? { value: gte, exclusive: false } : null;
  const upper = lt ? { value: lt, exclusive: true} : lte ? { value: lte, exclusive: false } : null;
  return create(field, lower, upper, metadata);
}

interface Bound { value: string; exclusive: boolean; }

function create(field: string, lower: Bound, upper: Bound, metadata?: any): Query {
  let name: string;
  if (!upper) {
    name = `<code>${field}</code> greater than ${lower.exclusive ? '' : 'or equal to '}${lower.value}`;
  } else if (!lower) {
    name = `<code>${field}</code>' less than ${upper.exclusive ? '' : 'or equal to '}${upper.value}`;
  } else {
    name = `<code>${field}</code> between ${lower .value} <small>${lower.exclusive ? '(exclusive) ' : '(inclusive) '}</small>
            and ${upper.value} <small>${upper.exclusive ? '(exclusive) ' : '(inclusive) '}</small>`;
  }
  return {
    id: id(),
    type: 'range',
    name: name,
    children: [],
    metadata: metadata,
    isExpanded: false
  };
}

