import checkEmail from "./checkEmail";
import checkPhone from "./checkPhone";

export default function checkPhoneOrEmail(val, skipEmpty, returnNull) {

  let res = checkPhone(val, skipEmpty, returnNull) || checkEmail(val, skipEmpty, returnNull);

  return res;
}
