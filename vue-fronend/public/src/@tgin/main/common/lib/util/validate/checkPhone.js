export default function checkPhone(val, emptyResult, returnNull) {

  if (returnNull) return null;

  if (typeof val == "undefined" || !val) return !!emptyResult;

  const valNumeric = val.replace(/[^\d]/g, '')

  return valNumeric.match(/^((\+7|7|8)[0-9]{10}|[^78][0-9]{9})$/) ? true : false
}
