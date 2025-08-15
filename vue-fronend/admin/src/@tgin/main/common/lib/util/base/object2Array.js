export default function objectToArray(obj, keyField='value', trans = {}) {

  let result = [], transKey;

  let cobj = obj

  for (var key in cobj) {

    let item = cobj[key];

    item[keyField] = key;

    for (transKey in trans) {
      item[trans[transKey]] = item[transKey];
    }

    result.push(item)
  }

  return result;
}
