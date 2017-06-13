import { Query } from './query';
import { parseMetadata } from './query-parser';
import { id } from './util';

export function parse(query: Object, parseChild: (child: Object) => Query): Query {
  const types = query['type'];
  const values = query['values'];
  const metadata = parseMetadata(query);
  return create(types, values, metadata);
}

function create(types?: string | string[], values?: string[], metadata?: any[]): Query {
  return {
    id: id(),
    type: 'ids',
    name: label(types, values),
    children: [],
    metadata: metadata,
    isExpanded: false
  };
}

function label(types?: string | string[], values?: string[]) {
  // an empty list of IDs is technically legal but matches nothing
  let label = values && values.length > 0 ? `has ID ${formatList(values, t => `<q>${t}</q>`)}` : 'has no ID';
  if (types) {
    label += ` and is of type ${formatList(types, t => `<code>${t}</code>`)}`;
  }
  return label;
}

function formatList(items: string | string[], formatItem = (t: string) => `${t}`): string {
  if (items instanceof Array) {
    if (items.length === 1) {
      return formatItem(items[0]);
    } else {
      return items.map(formatItem).slice(0, items.length - 1).join(', ') + ' or ' + formatItem(items[items.length - 1]);
    }
  } else {
    return formatItem(items);
  }
}
