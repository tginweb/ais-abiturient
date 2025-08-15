export default function checkSnils(value) {

  if (!/^\d{3}-\d{3}-\d{3}\s\d{2}$/.test(value)) {
    //return false;
  }
  value = value.replace(/\D/g, '');
  var checkSum = parseInt(value.slice(9), 10);
  value = value.substring(0, 9).split('');
  var sum = value.reduce(function (acc, next, index) {
    return acc + next * (9 - index);
  }, 0);
  const res = (sum < 100 && sum === checkSum)
      || ((sum === 100 || sum === 101) && checkSum === 0)
      || (sum > 101 && (sum % 101 === checkSum || (sum % 101 === 100 && checkSum === 0)));

  return res
}
