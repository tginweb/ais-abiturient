export default function checkEmail(val, skipEmpty, returnNull) {

  if (returnNull) return null;

  if (typeof val == "undefined" || !val) return !!skipEmpty;

  var re = /\S+@\S+\.\S+/;

  return re.test(val);
}
