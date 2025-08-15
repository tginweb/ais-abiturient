const cloneDeep = require('./cloneDeep').default

export function _filterTree(data, fn, childrenKey='children') {
  var r = data.filter(function(o) {
    if (o[childrenKey]) o[childrenKey] = _filterTree(o[childrenKey], fn);
    return fn(o)
  })
  return r;
}

export default function filterTree(data, fn) {
  return _filterTree(cloneDeep(data), fn);
}

