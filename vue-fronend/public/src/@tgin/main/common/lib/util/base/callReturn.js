export default function callReturn(val, that) {
  if ('function' == typeof val) {
    return val.call(that);
  } else {
    return val;
  }
}
