export function parseQuery(query: any, parent = ''): any[] {
  if (query instanceof Array) {
    return query.map((item, i) => {
      const id = parent + '.' + i;
      return {
        id: id,
        name: i,
        isExpanded: true,
        children: parseQuery(item, id)
      };
    });
  } else if (query instanceof Object) {
    return Object.getOwnPropertyNames(query).map((prop, i) => {
      const id = parent + '.' + i;
      return {
        id: id,
        name: prop,
        isExpanded: true,
        children: parseQuery(query[prop], id)
      };
    });
  } else {
    return [];
  }
}
