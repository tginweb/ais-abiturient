export default function classExtend(source, val, evaluateString = false) {

    let target = {}

    if (source) {
        if (Array.isArray(source)) {
            for (const [key, value] of Object.entries(source)) {
                target[value] = true
            }
        } else {
            target = source
        }
    }

    if (val) {
        if (typeof val === 'object') {
            if (Array.isArray(val)) {
                for (const [key, value] of Object.entries(val)) {
                    target[value] = true
                }
            } else {
                target = {
                    ...target,
                    ...val
                }
            }
        } else if (typeof val === 'string') {
            val.split(' ').forEach((cls) => {
                target[cls] = true
            })
        }
    }

    if (evaluateString) {

        let res = '';

        for (const [key, value] of Object.entries(target)) {
            if (value) {
                res = res + ' ' + key
            }
        }

        return res;
    }

    return target
}
