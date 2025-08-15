export default function phone(val) {

    let res

    const valNumeric = val.replace(/[^\d]/g, '')

    if (valNumeric.charAt(0) !== '7') {
        res = '+7' + val
    } else {
        res = val
    }

    if (res.charAt(0) !== '+') {
        res = '+' + res
    }

    return res
}

