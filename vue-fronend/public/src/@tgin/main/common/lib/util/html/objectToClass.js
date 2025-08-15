export default function objectToClass(val, res = '') {

    for (const [key, value] of Object.entries(val)) {
        if (value) {
            res = res + ' ' + key
        }
    }

    return res

}
