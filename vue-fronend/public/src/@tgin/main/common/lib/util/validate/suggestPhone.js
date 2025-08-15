export default function suggestPhone(val, skipEmpty, returnNull) {

  var regExp = /^(\+?7|7|8)?[\s\-]?\(?[9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/

  return val.match(regExp) ? true : false;
}
