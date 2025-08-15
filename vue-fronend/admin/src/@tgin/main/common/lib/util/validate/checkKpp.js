export default function checkKpp(val, skipEmpty, returnNull) {

  if (returnNull) return null;

  if (typeof val == "undefined" || !val) return !!skipEmpty;

  const regExp = /^\d{9}$/

  return !!val.match(regExp)
}
