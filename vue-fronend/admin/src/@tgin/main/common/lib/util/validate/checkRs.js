export default function checkRs(val, skipEmpty, returnNull) {

  if (returnNull) return null;

  if (typeof val == "undefined" || !val) return !!skipEmpty;

  const regExp = /^\d{20}$/

  return !!val.match(regExp)
}
