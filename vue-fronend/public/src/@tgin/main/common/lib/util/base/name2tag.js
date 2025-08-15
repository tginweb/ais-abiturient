import strtr from "locutus/php/strings/strtr";

export default function  name2tag(str) {
  return str ? strtr(str, {'.' : '-', ':' : '-', '_' : '-' }) : '';
}
