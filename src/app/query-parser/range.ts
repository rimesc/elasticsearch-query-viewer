import { Query } from './query';
import { parseMetadata } from './query-parser';
import { id } from './util';

export function parse(query: Object, parseChild: (child: Object) => Query): Query {
  const field = Object.getOwnPropertyNames(query)[0];
  const lt: number = query[field]['lt'];
  const lte: number = query[field]['lte'];
  const gt: number = query[field]['gt'];
  const gte: number = query[field]['gte'];
  const metadata = parseMetadata(query[field]);
  const lower = gt ? { value: gt, exclusive: true} : gte ? { value: gte, exclusive: false } : null;
  const upper = lt ? { value: lt, exclusive: true} : lte ? { value: lte, exclusive: false } : null;
  return create(field, lower, upper, metadata);
}

interface Bound { value: number; exclusive: boolean; }

function create(field: string, lower: Bound, upper: Bound, metadata?: any): Query {
  let name: string;
  if (!upper) {
    name = `'${field}' greater than ${lower.exclusive ? '' : 'or equal to '}'${lower.value}'`;
  } else if (!lower) {
    name = `'${field}' less than ${upper.exclusive ? '' : 'or equal to '}'${upper.value}'`;
  } else {
    name = `'${field}' between '${lower .value}' ${lower.exclusive ? '(exclusive) ' : '(inclusive) '}
            and '${upper.value}' ${upper.exclusive ? '(exclusive) ' : '(inclusive) '}`;
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

