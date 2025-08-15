export default function styleToString(val) {

    let res = ''

    if (typeof val === 'object') {
        if (Array.isArray(val)) {
            res = val.join(' ')
        } else {
            for (const [key, value] of Object.entries(val)) {
                if (value) {
                    res = res + ':' + key + ';'
                }
            }
        }
    }

    return res
}
