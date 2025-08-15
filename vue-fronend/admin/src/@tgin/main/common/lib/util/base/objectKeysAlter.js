'use strict';


export default function objectKeysAlter(obj, options) {

  let res = {}

  for (let key in obj) {

    let newKey = key

    if (options.prefix) newKey = options.prefix + newKey
    if (options.suffix) newKey = newKey + options.prefix

    res[newKey] = obj[key]
  }

  return res;
}
